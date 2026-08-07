<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRetreatTariffStatusRequest;
use App\Services\Supabase\SupabaseNotionEventsClient;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class RetreatTariffStatusController extends Controller
{
    public function __invoke(
        UpdateRetreatTariffStatusRequest $request,
        SupabaseNotionEventsClient $client,
        string $tariff,
    ): RedirectResponse {
        try {
            $client->updateEventStatus($tariff, $request->boolean('status'));
        } catch (QueryException $exception) {
            report($exception);

            throw ValidationException::withMessages([
                'status' => 'Не удалось изменить статус тарифа. Повторите попытку.',
            ]);
        }

        return back();
    }
}
