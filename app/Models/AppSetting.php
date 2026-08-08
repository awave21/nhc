<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

class AppSetting extends Model
{
    protected $fillable = ['key', 'value'];

    protected function value(): Attribute
    {
        return Attribute::make(
            get: function (?string $value): ?string {
                if ($value === null || $value === '') {
                    return $value;
                }

                try {
                    return Crypt::decryptString($value);
                } catch (Throwable) {
                    return $value;
                }
            },
            set: fn (?string $value): ?string => $value === null || $value === ''
                ? $value
                : Crypt::encryptString($value),
        );
    }

    public static function getValue(string $key, ?string $default = null): ?string
    {
        if (static::usesSupabaseApi()) {
            return static::getValueFromSupabase($key, $default);
        }

        $row = static::query()->where('key', $key)->first();

        return $row?->value ?? $default;
    }

    public static function setValue(string $key, ?string $value): self
    {
        if (static::usesSupabaseApi()) {
            return static::setValueInSupabase($key, $value);
        }

        return static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }

    private static function usesSupabaseApi(): bool
    {
        return strtolower((string) config('supabase.driver', 'postgrest')) === 'postgrest';
    }

    private static function getValueFromSupabase(string $key, ?string $default): ?string
    {
        try {
            $response = Http::withHeaders(static::supabaseHeaders())
                ->timeout(15)
                ->get(static::supabaseUrl(), [
                    'key' => 'eq.'.$key,
                    'select' => 'value',
                    'limit' => 1,
                ]);

            if (! $response->successful()) {
                return $default;
            }

            $value = $response->json('0.value');

            return is_string($value) && $value !== '' ? Crypt::decryptString($value) : $value ?? $default;
        } catch (Throwable) {
            return $default;
        }
    }

    private static function setValueInSupabase(string $key, ?string $value): self
    {
        $storedValue = $value === null || $value === '' ? $value : Crypt::encryptString($value);

        $response = Http::withHeaders(array_merge(static::supabaseHeaders(), [
            'Content-Type' => 'application/json',
            'Prefer' => 'resolution=merge-duplicates,return=representation',
        ]))->timeout(15)->post(static::supabaseUrl().'?on_conflict=key', [
            'key' => $key,
            'value' => $storedValue,
        ]);

        if (! $response->successful()) {
            throw new RuntimeException('Supabase app_settings update failed: '.$response->body());
        }

        return (new static)->forceFill([
            'key' => $key,
            'value' => $storedValue,
        ]);
    }

    /**
     * @return array<string, string>
     */
    private static function supabaseHeaders(): array
    {
        $key = (string) config('supabase.service_role_key');

        if ($key === '') {
            throw new RuntimeException('Supabase service_role key is not configured.');
        }

        return [
            'apikey' => $key,
            'Authorization' => 'Bearer '.$key,
        ];
    }

    private static function supabaseUrl(): string
    {
        $baseUrl = rtrim((string) config('supabase.url'), '/');

        if ($baseUrl === '') {
            throw new RuntimeException('Supabase URL is not configured.');
        }

        return $baseUrl.'/rest/v1/app_settings';
    }
}
