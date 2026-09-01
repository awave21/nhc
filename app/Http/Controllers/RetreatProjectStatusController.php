<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRetreatProjectStatusRequest;
use App\Services\Supabase\SupabaseNotionEventsClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Throwable;

class RetreatProjectStatusController extends Controller
{
    public function __invoke(
        UpdateRetreatProjectStatusRequest $request,
        SupabaseNotionEventsClient $client,
        string $project,
    ): RedirectResponse {
        try {
            $client->updateProjectStatus($project, (string) $request->string('status'));
        } catch (Throwable $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'status' => 'Не удалось изменить статус проекта. Повторите попытку.',
            ]);
        }

        return back();
    }
}
