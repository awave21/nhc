export type DialogiMessage = {
    id: string;
    role: 'user' | 'agent';
    content: string;
    createdAt: string | null;
    conversationId: string;
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

export type DialogiPageProps = {
    conversations: DialogiConversation[];
    messages: DialogiMessage[];
    loadError: string | null;
    /** Первая волна обрезана лимитом батчей — можно запросить /dialogi/more */
    dialogsTruncated: boolean;
    /** Следующий offset для limit/offset в Supabase (число уже загруженных строк) */
    dialogsNextOffset: number;
    /** Открыть тред по tg_chat_id (?conversation=) */
    initialConversationId?: string | null;
    /** Открыть тред по username, как в title беседы (?username=), без учёта регистра и ведущего @ */
    initialUsername?: string | null;
    /** Ключ — id беседы (tg_chat_id); последние обращение и заявка из Supabase */
    threadContextByConversation?: Record<string, DialogiThreadContextEntry>;
};
