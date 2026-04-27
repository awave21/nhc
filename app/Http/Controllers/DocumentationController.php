<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    /**
     * Страница документации по таблицам и структуре данных.
     */
    public function __invoke(Request $request): Response
    {
        $unlocked = (bool) $request->session()->get('documentation_resources_unlocked');

        return Inertia::render('documentation', [
            'documentationCoolifyPanelUrl' => config('documentation.resources.coolify_panel_url'),
            'documentationResourcesUnlocked' => $unlocked,
            'documentationResourceSecrets' => $unlocked
                ? [
                    'supabase_url' => config('documentation.resources.supabase_url'),
                    'supabase_credentials' => config('documentation.resources.supabase_credentials'),
                    'lightrag_url' => config('documentation.resources.lightrag_url'),
                    'coolify_email' => config('documentation.resources.coolify_email'),
                    'coolify_password' => config('documentation.resources.coolify_password'),
                    'redis_note' => config('documentation.resources.redis_note'),
                ]
                : null,
        ]);
    }
}
