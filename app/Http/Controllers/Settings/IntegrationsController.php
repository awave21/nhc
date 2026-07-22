<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationsController extends Controller
{
    public function edit(Request $request): Response
    {
        $key = AppSetting::getValue('openai.api_key');

        return Inertia::render('settings/integrations', [
            'openai' => [
                'has_key' => $key !== null && $key !== '',
                'masked_key' => $this->mask($key),
            ],
            'status' => $request->session()->get('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'openai_api_key' => ['nullable', 'string', 'min:10', 'max:255'],
        ]);

        $value = trim((string) ($validated['openai_api_key'] ?? ''));

        AppSetting::setValue('openai.api_key', $value === '' ? null : $value);

        return back()->with('status', 'openai-key-updated');
    }

    public function destroy(): RedirectResponse
    {
        AppSetting::setValue('openai.api_key', null);

        return back()->with('status', 'openai-key-removed');
    }

    private function mask(?string $key): ?string
    {
        if ($key === null || $key === '') {
            return null;
        }

        $length = mb_strlen($key);
        if ($length <= 8) {
            return str_repeat('•', $length);
        }

        return mb_substr($key, 0, 4).str_repeat('•', max(4, $length - 8)).mb_substr($key, -4);
    }
}
