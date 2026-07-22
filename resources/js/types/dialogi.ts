export type DialogiMessage = {
    id: string;
    role: 'user' | 'agent' | 'manager';
    content: string;
    createdAt: string | null;
    conversationId: string;
    /** message_id из Telegram — нужен для ответа (reply) на сообщение. */
    messageId?: number | null;
    /** Цитата сообщения, на которое это является ответом. */
    replyTo?: {
        content: string;
        role: 'user' | 'agent' | 'manager';
    } | null;
};

export type DialogiConversation = {
    id: string;
    title: string;
    preview: string;
    avatarUrl: string | null;
    /** ISO 8601 время последнего сообщения в треде */
    lastMessageAt: string | null;
};

/** Последняя эскалация / заявка для беседы (Supabase) */
export type DialogiThreadEntitySummary = {
    id: string;
    summary: string | null;
    at: string | null;
};

export type DialogiThreadContextEntry = {
    latestAppeal: DialogiThreadEntitySummary | null;
    latestOrder: DialogiThreadEntitySummary | null;
};

export type DialogiRealtime = {
    enabled: boolean;
    url: string | null;
    apikey: string | null;
    schema: string;
    table: string;
};

export type DialogiPageProps = {
    /** Конфиг Supabase Realtime (WebSocket) для живого обновления диалогов. */
    realtime?: DialogiRealtime;
    /** id бесед (tg_chat_id), которые сейчас перехвачены менеджером. */
    activeTakeovers?: string[];
    /** Отложенный проп (Inertia::defer); undefined до завершения загрузки. */
    conversations?: DialogiConversation[];
    /** Отложенный проп; undefined до завершения загрузки. */
    messages?: DialogiMessage[];
    /** Отложенный проп; undefined до завершения загрузки. */
    loadError?: string | null;
    /** Отложенный проп: первая волна обрезана лимитом батчей. */
    dialogsTruncated?: boolean;
    /** Отложенный проп: следующий offset для limit/offset в Supabase. */
    dialogsNextOffset?: number;
    /** Открыть тред по tg_chat_id (?conversation=) */
    initialConversationId?: string | null;
    /** Открыть тред по username, как в title беседы (?username=), без учёта регистра и ведущего @ */
    initialUsername?: string | null;
    /** Ключ — id беседы (tg_chat_id); последние обращение и заявка из Supabase */
    threadContextByConversation?: Record<string, DialogiThreadContextEntry>;
};
