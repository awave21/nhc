<?php

namespace App\Http\Controllers;

use App\Models\DialogTakeover;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DialogiTakeoverController extends Controller
{
    /**
     * Менеджер берёт диалог: ставим (продлеваем) флаг перехвата.
     * Пока флаг активен, гейт intake отвечает n8n suppress_llm=true.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tg_chat_id' => ['required', 'integer'],
        ]);

        $minutes = (int) config('dialogi.takeover_minutes', 30);

        $takeover = DialogTakeover::updateOrCreate(
            ['tg_chat_id' => $validated['tg_chat_id']],
            [
                'manager_id' => $request->user()?->id,
                'active_until' => Carbon::now()->addMinutes($minutes),
            ],
        );

        return response()->json([
            'tg_chat_id' => $takeover->tg_chat_id,
            'active' => true,
            'active_until' => $takeover->active_until?->toIso8601String(),
        ]);
    }

    /**
     * Менеджер отпускает диалог: снимаем перехват, бот снова отвечает.
     */
    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tg_chat_id' => ['required', 'integer'],
        ]);

        DialogTakeover::query()
            ->where('tg_chat_id', $validated['tg_chat_id'])
            ->delete();

        return response()->json([
            'tg_chat_id' => $validated['tg_chat_id'],
            'active' => false,
        ]);
    }
}
