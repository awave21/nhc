<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DocumentationUnlockController extends Controller
{
    public function unlock(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'passphrase' => ['required', 'string'],
        ]);

        $expected = (string) config('documentation.passphrase', 'Sarasvatii');

        if (! hash_equals($expected, $validated['passphrase'])) {
            return back()->withErrors([
                'passphrase' => 'Неверное кодовое слово.',
            ]);
        }

        $request->session()->put('documentation_resources_unlocked', true);

        return back();
    }

    public function lock(Request $request): RedirectResponse
    {
        $request->session()->forget('documentation_resources_unlocked');

        return back();
    }
}
