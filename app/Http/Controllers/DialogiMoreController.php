<?php

namespace App\Http\Controllers;

use App\Services\Dialogi\DialogiPresenter;
use App\Services\Supabase\SupabaseDialogsClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DialogiMoreController extends Controller
{
    /**
     * Следующая порция строк из Supabase (JSON), для кнопки «Загрузить ещё».
     */
    public function __invoke(Request $request, SupabaseDialogsClient $client): JsonResponse
    {
        $offset = max(0, (int) $request->query('offset', 0));

        $result = $client->fetchChunkAtOffset($request->user(), $offset);

        if (! $result['ok']) {
            return response()->json([
                'message' => $result['error'] ?? 'Ошибка загрузки',
            ], 422);
        }

        $presented = DialogiPresenter::fromRows($result['rows']);

        return response()->json([
            'conversations' => $presented['conversations'],
            'messages' => $presented['messages'],
            'nextOffset' => $result['next_offset'],
            'hasMore' => $result['has_more'],
        ]);
    }
}
