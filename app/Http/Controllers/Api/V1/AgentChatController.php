<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\VictoriaChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AgentChatController extends Controller
{
    public function __construct(private readonly VictoriaChatService $chat) {}

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:4000'],
            'user_context' => ['nullable', 'string', 'max:4000'],
        ]);

        try {
            $reply = $this->chat->reply(
                sessionId: $validated['session_id'],
                message: $validated['message'],
                userContext: $validated['user_context'] ?? null,
            );
        } catch (Throwable $e) {
            return response()->json([
                'session_id' => $validated['session_id'],
                'error' => 'agent_failed',
                'message' => $e->getMessage(),
            ], 502);
        }

        return response()->json([
            'session_id' => $validated['session_id'],
            'reply' => $reply,
        ]);
    }
}
