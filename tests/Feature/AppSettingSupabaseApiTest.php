<?php

namespace Tests\Feature;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AppSettingSupabaseApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Config::set('supabase.driver', 'postgrest');
        Config::set('supabase.url', 'https://supabase.test');
        Config::set('supabase.service_role_key', 'service-role-test');
    }

    public function test_it_reads_settings_through_the_supabase_api(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/app_settings*' => Http::response([
                ['value' => Crypt::encryptString('openai-test-key')],
            ]),
        ]);

        $value = AppSetting::getValue('openai.api_key');

        $this->assertSame('openai-test-key', $value);
        Http::assertSent(fn ($request): bool => $request->method() === 'GET'
            && $request->url() === 'https://supabase.test/rest/v1/app_settings?key=eq.openai.api_key&select=value&limit=1'
            && $request->hasHeader('apikey', 'service-role-test'));
    }

    public function test_it_writes_settings_through_the_supabase_api(): void
    {
        Http::fake([
            'https://supabase.test/rest/v1/app_settings*' => Http::response([], 201),
        ]);

        AppSetting::setValue('openai.api_key', 'openai-test-key');

        Http::assertSent(function ($request): bool {
            $data = $request->data();

            return $request->method() === 'POST'
                && $request->url() === 'https://supabase.test/rest/v1/app_settings?on_conflict=key'
                && $data['key'] === 'openai.api_key'
                && Crypt::decryptString($data['value']) === 'openai-test-key'
                && $request->hasHeader('Prefer', 'resolution=merge-duplicates,return=representation');
        });
    }
}
