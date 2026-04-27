<?php

namespace App\Http\Controllers;

use App\Services\Supabase\SupabaseDialogsClient;
use App\Services\Supabase\SupabaseEscalationMessageClient;
use App\Services\Supabase\SupabaseEventRegistrationsClient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Панель управления: сводные числа по разделам (Supabase / БД).
     */
    public function __invoke(
        Request $request,
        SupabaseDialogsClient $dialogsClient,
        SupabaseEventRegistrationsClient $registrationsClient,
        SupabaseEscalationMessageClient $escalationClient,
    ): Response {
        $dialogs = $dialogsClient->count($request->user());
        $orders = $registrationsClient->count();
        $appeals = $escalationClient->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'dialogs' => [
                    'count' => $dialogs['ok'] ? $dialogs['count'] : null,
                    'error' => $dialogs['ok'] ? null : $dialogs['error'],
                ],
                'orders' => [
                    'count' => $orders['ok'] ? $orders['count'] : null,
                    'error' => $orders['ok'] ? null : $orders['error'],
                ],
                'appeals' => [
                    'count' => $appeals['ok'] ? $appeals['count'] : null,
                    'error' => $appeals['ok'] ? null : $appeals['error'],
                ],
            ],
        ]);
    }
}
