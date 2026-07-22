import { useEffect, useRef } from 'react';
import type { DialogiMessage } from '@/types/dialogi';

export type DialogiRealtimeConfig = {
    enabled: boolean;
    url: string | null;
    apikey: string | null;
    schema: string;
    table: string;
};

type DialogRow = Record<string, unknown>;

function normalizeRole(raw: unknown): DialogiMessage['role'] {
    const s = String(raw ?? '')
        .trim()
        .toLowerCase();

    if (['manager', 'operator', 'human', 'staff'].includes(s)) {
        return 'manager';
    }

    if (
        ['agent', 'assistant', 'bot', 'victoria', 'model', 'ai', 'system'].includes(
            s,
        )
    ) {
        return 'agent';
    }

    return 'user';
}

/**
 * Превращает строку таблицы dialogs (как её отдаёт Supabase Realtime)
 * в DialogiMessage. Возвращает null, если строку нельзя привязать к треду.
 */
export function dialogRowToMessage(row: DialogRow): DialogiMessage | null {
    const chatId = row.tg_chat_id;

    if (chatId === null || chatId === undefined || chatId === '') {
        return null;
    }

    const createdRaw = row.created_at;
    let createdAt: string | null = null;

    if (typeof createdRaw === 'string' && createdRaw !== '') {
        const parsed = new Date(createdRaw);
        createdAt = Number.isNaN(parsed.getTime())
            ? null
            : parsed.toISOString();
    }

    return {
        id: String(row.id ?? ''),
        conversationId: String(chatId),
        role: normalizeRole(row.role),
        content: String(row.message ?? ''),
        createdAt,
        messageId:
            row.message_id === null || row.message_id === undefined
                ? null
                : Number(row.message_id),
    };
}

/**
 * Подписка на INSERT в таблицу dialogs через Supabase Realtime (WebSocket).
 * Требует, чтобы таблица была в публикации supabase_realtime на стороне Supabase.
 */
export function useDialogiRealtime(
    config: DialogiRealtimeConfig | undefined,
    onInsert: (message: DialogiMessage) => void,
): void {
    const onInsertRef = useRef(onInsert);
    onInsertRef.current = onInsert;

    const enabled = Boolean(config?.enabled && config?.url && config?.apikey);
    const url = config?.url ?? '';
    const apikey = config?.apikey ?? '';
    const schema = config?.schema ?? 'public';
    const table = config?.table ?? 'dialogs';

    useEffect(() => {
        if (!enabled) {
            return;
        }

        let ws: WebSocket | null = null;
        let heartbeat: number | undefined;
        let reconnectTimer: number | undefined;
        let closed = false;
        let refCounter = 0;

        const nextRef = (): string => String(++refCounter);

        const connect = (): void => {
            ws = new WebSocket(
                `${url}?apikey=${encodeURIComponent(apikey)}&vsn=1.0.0`,
            );

            ws.onopen = () => {
                ws?.send(
                    JSON.stringify({
                        topic: `realtime:${schema}:${table}`,
                        event: 'phx_join',
                        payload: {
                            config: {
                                postgres_changes: [
                                    { event: 'INSERT', schema, table },
                                ],
                            },
                        },
                        ref: nextRef(),
                    }),
                );

                heartbeat = window.setInterval(() => {
                    ws?.send(
                        JSON.stringify({
                            topic: 'phoenix',
                            event: 'heartbeat',
                            payload: {},
                            ref: nextRef(),
                        }),
                    );
                }, 25000);
            };

            ws.onmessage = (event) => {
                try {
                    const msg = JSON.parse(String(event.data));

                    if (msg.event !== 'postgres_changes') {
                        return;
                    }

                    const data = msg.payload?.data ?? msg.payload ?? {};
                    const record = data.record ?? data.new;

                    if (!record) {
                        return;
                    }

                    const message = dialogRowToMessage(record);

                    if (message) {
                        onInsertRef.current(message);
                    }
                } catch {
                    // Игнорируем некорректные кадры.
                }
            };

            ws.onclose = () => {
                if (heartbeat) {
                    window.clearInterval(heartbeat);
                }

                if (!closed) {
                    reconnectTimer = window.setTimeout(connect, 3000);
                }
            };

            ws.onerror = () => {
                ws?.close();
            };
        };

        connect();

        return () => {
            closed = true;

            if (heartbeat) {
                window.clearInterval(heartbeat);
            }

            if (reconnectTimer) {
                window.clearTimeout(reconnectTimer);
            }

            ws?.close();
        };
    }, [enabled, url, apikey, schema, table]);
}
