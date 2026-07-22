<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
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
        $row = static::query()->where('key', $key)->first();

        return $row?->value ?? $default;
    }

    public static function setValue(string $key, ?string $value): self
    {
        return static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
