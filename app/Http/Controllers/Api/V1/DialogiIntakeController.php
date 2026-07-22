<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DialogTakeover;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DialogiIntakeController extends Controller
{
    /**
     * Гейт для n8n: по входящему сообщению решает, должен ли LLM отвечать.
     * Если менеджер ведёт этот чат, бот молчит (реплики идут от менеджера).
     */
    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tg_chat_id' => ['required', 'integer'],
        ]);

        $managerActive = DialogTakeover::isActiveFor($validated['tg_chat_id']);

        return response()->json([
            'tg_chat_id' => $validated['tg_chat_id'],
            'mode' => $managerActive ? 'manager' : 'agent',
            'suppress_llm' => $managerActive,
        ]);
    }
}
