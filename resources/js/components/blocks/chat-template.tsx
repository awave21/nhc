import { Form, Link } from '@inertiajs/react';
import {
    Brush,
    Camera,
    ChartBarIncreasing,
    ChevronLeft,
    CircleAlert,
    CircleOff,
    CircleUserRound,
    File,
    FileText,
    Image,
    ListFilter,
    MessageSquareDashed,
    MessageSquareDot,
    Mic,
    Paperclip,
    Reply,
    Search,
    Send,
    Smile,
    SquarePen,
    Star,
    Loader2,
    Trash2,
    User,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import DialogiClearController from '@/actions/App/Http/Controllers/DialogiClearController';

import { ChatMessageMarkdown } from '@/components/chat-message-markdown';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { compareDialogiInstants } from '@/lib/compare-dialogi-instants';
import type { DialogiBannerDismissed } from '@/lib/dialogi-thread-banner-storage';
import {
    readDialogiBannerDismissed,
    writeDialogiBannerDismissed,
} from '@/lib/dialogi-thread-banner-storage';
import { formatChatMessageTime } from '@/lib/format-chat-message-time';
import { cn } from '@/lib/utils';
import { appeals, order } from '@/routes';
import type {
    DialogiConversation,
    DialogiMessage,
    DialogiThreadContextEntry,
} from '@/types/dialogi';

function titleAvatarLetter(title: string): string {
    const base = title.replace(/^@/u, '').trim();
    const ch = base[0];

    return ch ? ch.toUpperCase() : '?';
}

function normalizeDialogUsername(value: string): string {
    return value.replace(/^@/u, '').trim().toLowerCase();
}

function conversationIdForUsername(
    list: DialogiConversation[],
    username: string,
): string | null {
    const target = normalizeDialogUsername(username);

    if (target === '') {
        return null;
    }

    const found = list.find(
        (c) => normalizeDialogUsername(c.title) === target,
    );

    return found?.id ?? null;
}

function resolveInitialThreadId(
    list: DialogiConversation[] | undefined,
    initialConversationId: string | null | undefined,
    initialUsername: string | null | undefined,
): string {
    if (! list || list.length === 0) {
        return '_default';
    }

    if (
        initialConversationId &&
        list.some((c) => c.id === String(initialConversationId))
    ) {
        return String(initialConversationId);
    }

    if (initialUsername) {
        const byName = conversationIdForUsername(list, initialUsername);

        if (byName) {
            return byName;
        }
    }

    return list[0].id;
}

export type ChatTemplateProps = {
    /** Допускаем undefined: пропс отдаётся через Inertia::defer и при
     *  первичной гидрации страницы может ещё не быть в page.props. */
    conversations?: DialogiConversation[];
    /** Аналогично — отложенный проп. */
    messages?: DialogiMessage[];
    loadError?: string | null;
    dialogsHasMore?: boolean;
    loadMorePending?: boolean;
    onLoadMore?: () => void;
    initialConversationId?: string | null;
    initialUsername?: string | null;
    threadContextByConversation?: Record<string, DialogiThreadContextEntry>;
    activeTakeovers?: string[];
};

/**
 * Oldest first (top) → newest last (bottom), stable tie-break by id.
 * Rows without created_at sort after dated rows.
 */
function sortMessages(a: DialogiMessage, b: DialogiMessage): number {
    const byTime = compareDialogiInstants(a.createdAt, b.createdAt);

    if (byTime !== 0) {
        return byTime;
    }

    return a.id.localeCompare(b.id);
}

export const Home = ({
    conversations = [],
    messages = [],
    loadError,
    dialogsHasMore = false,
    loadMorePending = false,
    onLoadMore,
    initialConversationId = null,
    initialUsername = null,
    threadContextByConversation = {},
    activeTakeovers = [],
}: ChatTemplateProps) => {
    const requestedSelectionKey = `${initialConversationId ?? ''}:${initialUsername ?? ''}`;
    const requestedConversationId = useMemo(
        () =>
            resolveInitialThreadId(
                conversations,
                initialConversationId,
                initialUsername,
            ),
        [conversations, initialConversationId, initialUsername],
    );
    const [manualSelection, setManualSelection] = useState<{
        requestedSelectionKey: string;
        id: string;
    } | null>(null);
    const [search, setSearch] = useState('');
    const [draft, setDraft] = useState('');
    const [sending, setSending] = useState(false);
    const [replyingTo, setReplyingTo] = useState<DialogiMessage | null>(null);
    // Мобильное меню действий по долгому нажатию на сообщение.
    const [actionMenuMsg, setActionMenuMsg] = useState<DialogiMessage | null>(
        null,
    );
    const [pressingId, setPressingId] = useState<string | null>(null);
    const longPressTimer = useRef<number | null>(null);
    const [localSent, setLocalSent] = useState<DialogiMessage[]>([]);
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
    const [takenIds, setTakenIds] = useState<Set<string>>(
        () => new Set(activeTakeovers),
    );
    // Проп activeTakeovers доезжает после первого рендера (Deferred-обёртка),
    // поэтому синхронизируем состояние при изменении его содержимого.
    const activeTakeoversKey = activeTakeovers.join('|');
    useEffect(() => {
        setTakenIds(new Set(activeTakeoversKey ? activeTakeoversKey.split('|') : []));
    }, [activeTakeoversKey]);
    const [takeoverPending, setTakeoverPending] = useState(false);
    // На мобиле показываем одну панель: список бесед либо открытый тред.
    const [mobileView, setMobileView] = useState<'list' | 'thread'>('list');
    const [bannerDismissed, setBannerDismissed] =
        useState<DialogiBannerDismissed>(readDialogiBannerDismissed);
    const threadEndRef = useRef<HTMLDivElement>(null);

    const patchBannerDismiss = (
        conversationId: string,
        patch: { appeal?: string; order?: string },
    ) => {
        setBannerDismissed((prev) => {
            const next: DialogiBannerDismissed = {
                ...prev,
                [conversationId]: { ...prev[conversationId], ...patch },
            };
            writeDialogiBannerDismissed(next);

            return next;
        });
    };

    const activeConversationId = useMemo((): string => {
        if (conversations.length === 0) {
            return '_default';
        }

        const selectedId =
            manualSelection?.requestedSelectionKey === requestedSelectionKey
                ? manualSelection.id
                : requestedConversationId;

        if (conversations.some((c) => c.id === selectedId)) {
            return selectedId;
        }

        return conversations[0].id;
    }, [conversations, manualSelection, requestedConversationId, requestedSelectionKey]);

    const filteredConversations = useMemo(() => {
        const q = search.trim().toLowerCase();

        if (q === '') {
            return conversations;
        }

        return conversations.filter(
            (c) =>
                c.title.toLowerCase().includes(q) ||
                c.preview.toLowerCase().includes(q),
        );
    }, [conversations, search]);

    const current = useMemo(
        () =>
            conversations.find((c) => c.id === activeConversationId) ??
            conversations[0],
        [conversations, activeConversationId],
    );

    const threadMessages = useMemo(() => {
        const combined = messages
            .filter((m) => m.conversationId === activeConversationId)
            .concat(
                localSent.filter(
                    (m) => m.conversationId === activeConversationId,
                ),
            )
            .filter((m) => !deletedIds.has(m.id));

        // Дедуп по id: одно и то же сообщение может прийти и оптимистично
        // (localSent, с цитатой replyTo), и из Supabase / realtime (без неё).
        // При слиянии сохраняем replyTo от той версии, где он есть.
        const byId = new Map<string, DialogiMessage>();

        for (const m of combined) {
            const prev = byId.get(m.id);
            byId.set(
                m.id,
                prev
                    ? { ...prev, ...m, replyTo: prev.replyTo ?? m.replyTo }
                    : m,
            );
        }

        return [...byId.values()].sort(sortMessages);
    }, [messages, activeConversationId, localSent, deletedIds]);

    const canSend = current != null && activeConversationId !== '_default';

    const sendMessage = useCallback(async () => {
        const text = draft.trim();

        if (text === '' || sending || !canSend) {
            return;
        }

        setSending(true);

        try {
            const xsrf = decodeURIComponent(
                document.cookie.match(/XSRF-TOKEN=([^;]+)/u)?.[1] ?? '',
            );

            const response = await fetch('/dialogi/send', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrf,
                },
                body: JSON.stringify({
                    tg_chat_id: Number(activeConversationId),
                    message: text,
                    tg_username:
                        current?.title?.replace(/^@/u, '') ?? null,
                    reply_to_message_id: replyingTo?.messageId ?? null,
                    reply_to_content: replyingTo?.content ?? null,
                    reply_to_role: replyingTo?.role ?? null,
                }),
            });

            const data: {
                ok?: boolean;
                message?: DialogiMessage;
                message_text?: string;
            } = await response.json();

            if (!response.ok || !data.ok || !data.message) {
                throw new Error('send_failed');
            }

            setLocalSent((prev) => [
                ...prev,
                {
                    ...(data.message as DialogiMessage),
                    conversationId: activeConversationId,
                    replyTo: replyingTo
                        ? {
                              content: replyingTo.content,
                              role: replyingTo.role,
                          }
                        : null,
                },
            ]);
            setDraft('');
            setReplyingTo(null);
        } catch {
            // Ошибку позже выведем в toast; пока просто снимаем состояние отправки.
        } finally {
            setSending(false);
        }
    }, [draft, sending, canSend, activeConversationId, current, replyingTo]);

    const isTakenOver = takenIds.has(activeConversationId);

    const toggleTakeover = useCallback(async () => {
        if (takeoverPending || activeConversationId === '_default') {
            return;
        }

        const currentlyTaken = takenIds.has(activeConversationId);
        setTakeoverPending(true);

        try {
            const xsrf = decodeURIComponent(
                document.cookie.match(/XSRF-TOKEN=([^;]+)/u)?.[1] ?? '',
            );

            const response = await fetch('/dialogi/takeover', {
                method: currentlyTaken ? 'DELETE' : 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': xsrf,
                },
                body: JSON.stringify({
                    tg_chat_id: Number(activeConversationId),
                }),
            });

            const data: { active?: boolean } = await response.json();

            if (!response.ok) {
                throw new Error('takeover_failed');
            }

            setTakenIds((prev) => {
                const next = new Set(prev);

                if (data.active) {
                    next.add(activeConversationId);
                } else {
                    next.delete(activeConversationId);
                }

                return next;
            });
        } catch {
            // Ошибку позже выведем в toast.
        } finally {
            setTakeoverPending(false);
        }
    }, [takeoverPending, activeConversationId, takenIds]);

    const deleteMessage = useCallback(
        async (id: string) => {
            // Защита от повторных нажатий: если уже удаляем — выходим.
            let alreadyDeleting = false;

            setDeletingIds((prev) => {
                if (prev.has(id)) {
                    alreadyDeleting = true;

                    return prev;
                }

                const next = new Set(prev);
                next.add(id);

                return next;
            });

            if (alreadyDeleting) {
                return;
            }

            try {
                const xsrf = decodeURIComponent(
                    document.cookie.match(/XSRF-TOKEN=([^;]+)/u)?.[1] ?? '',
                );

                const response = await fetch('/dialogi/message', {
                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': xsrf,
                    },
                    body: JSON.stringify({ id: Number(id) }),
                });

                const data: { ok?: boolean } = await response.json();

                if (!response.ok || !data.ok) {
                    throw new Error('delete_failed');
                }

                // Даём анимации исчезновения проиграться, затем убираем из списка.
                window.setTimeout(() => {
                    setDeletedIds((prev) => new Set(prev).add(id));
                    setDeletingIds((prev) => {
                        const next = new Set(prev);
                        next.delete(id);

                        return next;
                    });
                }, 300);
            } catch {
                // Возвращаем сообщение в исходное состояние.
                setDeletingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);

                    return next;
                });
            }
        },
        [],
    );

    const startLongPress = useCallback((m: DialogiMessage) => {
        setPressingId(m.id);

        if (longPressTimer.current) {
            window.clearTimeout(longPressTimer.current);
        }

        longPressTimer.current = window.setTimeout(() => {
            setActionMenuMsg(m);
            setPressingId(null);
        }, 450);
    }, []);

    const cancelLongPress = useCallback(() => {
        if (longPressTimer.current) {
            window.clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        setPressingId(null);
    }, []);

    const threadContextEntry = threadContextByConversation[activeConversationId];

    const visibleAppeal = useMemo(() => {
        const a = threadContextEntry?.latestAppeal;

        if (!a) {
            return null;
        }

        if (bannerDismissed[activeConversationId]?.appeal === a.id) {
            return null;
        }

        return a;
    }, [threadContextEntry, bannerDismissed, activeConversationId]);

    const visibleOrder = useMemo(() => {
        const o = threadContextEntry?.latestOrder;

        if (!o) {
            return null;
        }

        if (bannerDismissed[activeConversationId]?.order === o.id) {
            return null;
        }

        return o;
    }, [threadContextEntry, bannerDismissed, activeConversationId]);

    useLayoutEffect(() => {
        threadEndRef.current?.scrollIntoView({
            behavior: 'auto',
            block: 'end',
        });
    }, [activeConversationId, threadMessages]);

    return (
        <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background">
            {loadError ? (
                <Alert variant="destructive" className="m-4 rounded-xl border">
                    <CircleAlert />
                    <AlertTitle>Не удалось загрузить диалоги</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            ) : null}

            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-0 flex-1"
                data-mobile-view={mobileView}
            >
                <ResizablePanel
                    defaultSize={28}
                    minSize={22}
                    className="min-h-0"
                >
                    <div className="flex h-full min-h-0 flex-col border-r border-sidebar-border/50 dark:border-sidebar-border/80">
                        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-4 py-3 dark:border-sidebar-border/80">
                            <h2 className="text-base font-semibold tracking-tight text-foreground">
                                Беседы
                            </h2>
                            <div className="flex items-center gap-0.5">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-muted-foreground hover:text-foreground"
                                        >
                                            <SquarePen className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="rounded-xl"
                                    >
                                        <DropdownMenuItem className="rounded-lg">
                                            <User /> Новый контакт
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <Users /> Новая группа
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full text-muted-foreground hover:text-foreground"
                                        >
                                            <ListFilter className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-56 rounded-xl"
                                    >
                                        <DropdownMenuLabel className="text-muted-foreground">
                                            Фильтр
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="rounded-lg">
                                                <MessageSquareDot />{' '}
                                                Непрочитанные
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                                <Star /> Избранное
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                                <CircleUserRound /> Контакты
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                                <CircleOff /> Не в контактах
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className="rounded-lg">
                                                <Users /> Группы
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                                <MessageSquareDashed />{' '}
                                                Черновики
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="shrink-0 px-3 pt-3 pb-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Поиск или новая беседа"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 rounded-full border-sidebar-border/60 bg-neutral-50/80 pl-10 dark:border-sidebar-border dark:bg-neutral-900/40"
                                />
                            </div>
                        </div>

                        <ScrollArea className="min-h-0 flex-1 px-2 pb-3">
                            <div className="flex flex-col gap-1 pr-1">
                                {filteredConversations.length === 0 ? (
                                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                                        {conversations.length === 0
                                            ? 'Нет бесед'
                                            : 'Ничего не найдено по запросу'}
                                    </p>
                                ) : null}
                                {filteredConversations.map((contact) => {
                                    const isActive =
                                        activeConversationId === contact.id;
                                    const listTimeLabel = formatChatMessageTime(
                                        contact.lastMessageAt,
                                    );
                                    const isContactTaken = takenIds.has(
                                        contact.id,
                                    );

                                    return (
                                        <button
                                            key={contact.id}
                                            type="button"
                                            onClick={() => {
                                                setManualSelection({
                                                    requestedSelectionKey,
                                                    id: contact.id,
                                                });
                                                setMobileView('thread');
                                            }}
                                            className={cn(
                                                'flex w-full min-w-0 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-[background-color,box-shadow]',
                                                'hover:bg-neutral-50/90 dark:hover:bg-neutral-800/50',
                                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                isActive &&
                                                    'bg-sidebar-accent/70 shadow-sm dark:bg-sidebar-accent/50',
                                            )}
                                        >
                                            <div className="flex min-w-0 flex-1 flex-row items-start gap-3">
                                                <div className="relative shrink-0">
                                                    <Avatar
                                                        className={cn(
                                                            'size-11 ring-offset-background',
                                                            isActive &&
                                                                'ring-2 ring-primary/25',
                                                        )}
                                                    >
                                                        {contact.avatarUrl ? (
                                                            <AvatarImage
                                                                src={
                                                                    contact.avatarUrl
                                                                }
                                                                alt=""
                                                            />
                                                        ) : null}
                                                        <AvatarFallback className="bg-muted text-sm text-muted-foreground">
                                                            {titleAvatarLetter(
                                                                contact.title,
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span
                                                        className={cn(
                                                            'absolute -end-0.5 -bottom-0.5 size-3.5 rounded-full ring-2 ring-background',
                                                            isContactTaken
                                                                ? 'bg-emerald-500'
                                                                : 'bg-sky-500',
                                                        )}
                                                        title={
                                                            isContactTaken
                                                                ? 'Ведёт менеджер'
                                                                : 'Отвечает агент'
                                                        }
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-0.5">
                                                    <div className="flex min-w-0 items-baseline justify-between gap-2">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {contact.title}
                                                        </p>
                                                        {listTimeLabel ? (
                                                            <span className="shrink-0 text-[11px] tracking-tight text-muted-foreground tabular-nums">
                                                                {listTimeLabel}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <p className="line-clamp-2 text-xs leading-snug break-words text-muted-foreground">
                                                        <span
                                                            className={cn(
                                                                'mr-1 rounded px-1 py-0.5 align-middle text-[10px] font-medium',
                                                                isContactTaken
                                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                                    : 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
                                                            )}
                                                        >
                                                            {isContactTaken
                                                                ? 'Менеджер'
                                                                : 'Агент'}
                                                        </span>
                                                        {contact.preview}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                                {dialogsHasMore && onLoadMore ? (
                                    <div className="px-2 pt-2 pb-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="h-9 w-full rounded-xl text-xs"
                                            disabled={loadMorePending}
                                            onClick={onLoadMore}
                                        >
                                            {loadMorePending
                                                ? 'Загрузка…'
                                                : 'Загрузить ещё сообщения'}
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>

                <ResizableHandle className="w-px transition-colors hover:bg-sidebar-border/80" />

                <ResizablePanel
                    defaultSize={72}
                    minSize={40}
                    className="min-h-0"
                >
                    <div className="flex h-full min-h-0 flex-col">
                        <div className="flex h-16 shrink-0 items-center gap-1 border-b border-sidebar-border/50 px-3 lg:px-4 dark:border-sidebar-border/80">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileView('list')}
                                aria-label="Назад к беседам"
                                className="shrink-0 rounded-full text-muted-foreground hover:text-foreground lg:hidden"
                            >
                                <ChevronLeft className="size-5" />
                            </Button>
                            <Avatar className="size-11 ring-2 ring-border ring-offset-2 ring-offset-background">
                                {current?.avatarUrl ? (
                                    <AvatarImage
                                        src={current.avatarUrl}
                                        alt=""
                                    />
                                ) : null}
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                    {titleAvatarLetter(current?.title ?? '')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 min-w-0 flex-1 space-y-0.5">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {current?.title ?? 'Виктория'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Ассистент Method NHC
                                </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-0.5">
                                {activeConversationId !== '_default' && current ? (
                                    <>
                                        <div className="flex items-center gap-2 pr-1">
                                            <span
                                                className={cn(
                                                    'hidden text-xs font-medium whitespace-nowrap sm:inline',
                                                    isTakenOver
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-muted-foreground',
                                                )}
                                            >
                                                {isTakenOver
                                                    ? 'Менеджер'
                                                    : 'Агент'}
                                            </span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={isTakenOver}
                                                onClick={() =>
                                                    void toggleTakeover()
                                                }
                                                disabled={takeoverPending}
                                                title={
                                                    isTakenOver
                                                        ? 'Вернуть диалог агенту (автоответ включится)'
                                                        : 'Взять диалог на себя (агент замолчит)'
                                                }
                                                className={cn(
                                                    'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors disabled:opacity-60',
                                                    isTakenOver
                                                        ? 'bg-emerald-600'
                                                        : 'bg-muted-foreground/30',
                                                )}
                                            >
                                                <span
                                                    className={cn(
                                                        'inline-block size-4 transform rounded-full bg-white shadow transition-transform',
                                                        isTakenOver
                                                            ? 'translate-x-4'
                                                            : 'translate-x-0.5',
                                                    )}
                                                />
                                            </button>
                                        </div>
                                        <Form
                                            {...DialogiClearController.form()}
                                        options={{ preserveScroll: false }}
                                        onBefore={() =>
                                            window.confirm(
                                                `Удалить переписку и контекстную память для ${current.title}? Действие нельзя отменить.`,
                                            )
                                        }
                                    >
                                        {({ processing }) => (
                                            <>
                                                <input
                                                    type="hidden"
                                                    name="tg_chat_id"
                                                    value={current.id}
                                                />
                                                <Button
                                                    type="submit"
                                                    variant="ghost"
                                                    size="icon"
                                                    disabled={processing}
                                                    className="rounded-full text-muted-foreground hover:text-destructive"
                                                    title="Очистить переписку и память агента"
                                                    aria-label="Очистить переписку и память агента"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                    </>
                                ) : null}
                            </div>
                        </div>

                        {activeConversationId !== '_default' &&
                        (visibleAppeal || visibleOrder) ? (
                            <div className="shrink-0 border-b border-sidebar-border/50 bg-muted/35 px-4 py-2.5 dark:border-sidebar-border/80">
                                <p className="mb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                    По данным Supabase
                                </p>
                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                                    {visibleAppeal ? (
                                        <div
                                            className={cn(
                                                'flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-2.5 py-1.5 dark:border-amber-400/20 dark:bg-amber-400/[0.08]',
                                            )}
                                        >
                                            <CircleAlert
                                                className="size-3.5 shrink-0 text-amber-700/80 dark:text-amber-300/90"
                                                aria-hidden
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium text-foreground">
                                                    Последнее обращение
                                                </p>
                                                {visibleAppeal.summary ? (
                                                    <p className="truncate text-[11px] text-muted-foreground">
                                                        {visibleAppeal.summary}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 shrink-0 px-2 text-xs"
                                                asChild
                                            >
                                                <Link
                                                    href={appeals({
                                                        query: {
                                                            row: visibleAppeal.id,
                                                        },
                                                    })}
                                                >
                                                    Открыть
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                                aria-label="Скрыть подсказку об обращении"
                                                onClick={() =>
                                                    patchBannerDismiss(
                                                        activeConversationId,
                                                        {
                                                            appeal: visibleAppeal.id,
                                                        },
                                                    )
                                                }
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        </div>
                                    ) : null}
                                    {visibleOrder ? (
                                        <div
                                            className={cn(
                                                'flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-sky-500/25 bg-sky-500/[0.07] px-2.5 py-1.5 dark:border-sky-400/20 dark:bg-sky-400/[0.08]',
                                            )}
                                        >
                                            <FileText
                                                className="size-3.5 shrink-0 text-sky-700/80 dark:text-sky-300/90"
                                                aria-hidden
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-medium text-foreground">
                                                    Последняя заявка
                                                </p>
                                                {visibleOrder.summary ? (
                                                    <p className="truncate text-[11px] text-muted-foreground">
                                                        {visibleOrder.summary}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 shrink-0 px-2 text-xs"
                                                asChild
                                            >
                                                <Link
                                                    href={order({
                                                        query: {
                                                            row: visibleOrder.id,
                                                        },
                                                    })}
                                                >
                                                    Открыть
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                                aria-label="Скрыть подсказку о заявке"
                                                onClick={() =>
                                                    patchBannerDismiss(
                                                        activeConversationId,
                                                        {
                                                            order: visibleOrder.id,
                                                        },
                                                    )
                                                }
                                            >
                                                <X className="size-3.5" />
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ) : null}

                        <ScrollArea className="relative min-h-0 flex-1 bg-neutral-50/40 dark:bg-neutral-950/40">
                            <div className="flex flex-col gap-2.5 px-4 py-5">
                                {threadMessages.length === 0 ? (
                                    <div className="flex min-h-[12rem] items-center justify-center p-6 text-center text-sm leading-relaxed text-muted-foreground">
                                        Сообщения появятся здесь
                                    </div>
                                ) : (
                                    threadMessages.map((m) => {
                                        const timeLabel = formatChatMessageTime(
                                            m.createdAt,
                                        );
                                        const isDeleting = deletingIds.has(m.id);

                                        return (
                                            <div
                                                key={m.id}
                                                className={cn(
                                                    'flex w-full',
                                                    m.role === 'user'
                                                        ? 'justify-start'
                                                        : 'justify-end',
                                                )}
                                            >
                                                <div
                                                    onPointerDown={(e) => {
                                                        if (e.button === 0) {
                                                            startLongPress(m);
                                                        }
                                                    }}
                                                    onPointerUp={cancelLongPress}
                                                    onPointerMove={
                                                        cancelLongPress
                                                    }
                                                    onPointerLeave={
                                                        cancelLongPress
                                                    }
                                                    onPointerCancel={
                                                        cancelLongPress
                                                    }
                                                    onContextMenu={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    className={cn(
                                                        'group flex max-w-[min(82%,30rem)] min-w-0 flex-col gap-1.5 overflow-hidden rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed shadow-sm ring-1 ring-black/[0.02] select-none dark:ring-white/[0.04]',
                                                        'transition-all duration-300 ease-out',
                                                        'animate-in fade-in slide-in-from-bottom-2',
                                                        pressingId === m.id &&
                                                            'scale-[0.97] opacity-80',
                                                        isDeleting &&
                                                            'pointer-events-none -translate-y-1 scale-95 opacity-0',
                                                        m.role === 'user' &&
                                                            'rounded-bl-md bg-muted text-foreground',
                                                        m.role === 'agent' &&
                                                            'rounded-br-md bg-primary/[0.12] text-foreground backdrop-blur-md dark:bg-primary/[0.18] dark:backdrop-blur-lg',
                                                        m.role === 'manager' &&
                                                            'rounded-br-md bg-emerald-500/[0.14] text-foreground backdrop-blur-md dark:bg-emerald-500/[0.2] dark:backdrop-blur-lg',
                                                    )}
                                                >
                                                    {m.role !== 'user' ? (
                                                        <span
                                                            className={cn(
                                                                'text-[11px] leading-none font-semibold tracking-tight',
                                                                m.role ===
                                                                    'manager'
                                                                    ? 'text-emerald-700 dark:text-emerald-300'
                                                                    : 'text-primary/90',
                                                            )}
                                                        >
                                                            {m.role === 'manager'
                                                                ? 'Менеджер'
                                                                : 'Виктория'}
                                                        </span>
                                                    ) : null}
                                                    {m.replyTo ? (
                                                        <div
                                                            className={cn(
                                                                'rounded-lg border-l-2 px-2.5 py-1.5',
                                                                m.replyTo.role ===
                                                                    'manager'
                                                                    ? 'border-emerald-500/70 bg-emerald-500/10'
                                                                    : m.replyTo
                                                                            .role ===
                                                                        'agent'
                                                                      ? 'border-primary/60 bg-primary/10'
                                                                      : 'border-muted-foreground/40 bg-black/[0.04] dark:bg-white/[0.06]',
                                                            )}
                                                        >
                                                            <p
                                                                className={cn(
                                                                    'text-[11px] leading-none font-semibold',
                                                                    m.replyTo
                                                                        .role ===
                                                                        'manager'
                                                                        ? 'text-emerald-700 dark:text-emerald-300'
                                                                        : m.replyTo
                                                                                .role ===
                                                                            'agent'
                                                                          ? 'text-primary/90'
                                                                          : 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {m.replyTo
                                                                    .role ===
                                                                'manager'
                                                                    ? 'Менеджер'
                                                                    : m.replyTo
                                                                            .role ===
                                                                        'agent'
                                                                      ? 'Виктория'
                                                                      : 'Пользователь'}
                                                            </p>
                                                            <p className="mt-1 line-clamp-2 text-xs break-all opacity-70">
                                                                {
                                                                    m.replyTo
                                                                        .content
                                                                }
                                                            </p>
                                                        </div>
                                                    ) : null}
                                                    <ChatMessageMarkdown
                                                        content={m.content}
                                                        variant={
                                                            m.role === 'user'
                                                                ? 'user'
                                                                : 'agent'
                                                        }
                                                    />
                                                    <div className="flex items-center justify-end gap-1.5 self-end">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setReplyingTo(m)
                                                            }
                                                            aria-label="Ответить"
                                                            title="Ответить"
                                                            className="rounded-full p-0.5 text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-foreground max-lg:hidden"
                                                        >
                                                            <Reply className="size-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                void deleteMessage(
                                                                    m.id,
                                                                )
                                                            }
                                                            disabled={isDeleting}
                                                            aria-label="Удалить сообщение"
                                                            title="Удалить сообщение"
                                                            className={cn(
                                                                'rounded-full p-0.5 text-muted-foreground transition hover:text-red-600 max-lg:hidden',
                                                                isDeleting
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0 group-hover:opacity-100',
                                                            )}
                                                        >
                                                            {isDeleting ? (
                                                                <Loader2 className="size-3.5 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="size-3.5" />
                                                            )}
                                                        </button>
                                                        {timeLabel ? (
                                                            <span className="text-[10px] tracking-tight text-muted-foreground/80 tabular-nums">
                                                                {timeLabel}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div
                                    ref={threadEndRef}
                                    className="h-0 shrink-0"
                                    aria-hidden
                                />
                            </div>
                        </ScrollArea>

                        <div className="shrink-0 border-t border-sidebar-border/50 bg-background/95 px-3 py-3 backdrop-blur-sm dark:border-sidebar-border/80">
                            {replyingTo ? (
                                <div className="mb-2 flex items-center gap-2 rounded-xl border-l-2 border-primary bg-muted/60 py-1.5 pr-1.5 pl-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-medium text-primary">
                                            В ответ{' '}
                                            {replyingTo.role === 'user'
                                                ? (current?.title ??
                                                  'пользователю')
                                                : replyingTo.role === 'manager'
                                                  ? 'менеджеру'
                                                  : 'Виктории'}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {replyingTo.content}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setReplyingTo(null)}
                                        aria-label="Отменить ответ"
                                        className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            ) : null}
                            <div
                                className={cn(
                                    'flex items-center gap-1 rounded-2xl border border-sidebar-border/60 bg-neutral-50/50 p-1.5 dark:border-sidebar-border dark:bg-neutral-900/40',
                                    !canSend && 'opacity-60',
                                )}
                                aria-disabled={!canSend}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    disabled
                                    className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Smile className="size-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            disabled
                                            className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                        >
                                            <Paperclip className="size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="rounded-xl"
                                    >
                                        <DropdownMenuItem className="rounded-lg">
                                            <Image /> Фото и видео
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <Camera /> Камера
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <File /> Документ
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <UserRound /> Контакт
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <ChartBarIncreasing /> Опрос
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="rounded-lg">
                                            <Brush /> Рисунок
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Input
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            void sendMessage();
                                        }
                                    }}
                                    disabled={!canSend || sending}
                                    className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                                    placeholder={
                                        canSend
                                            ? 'Написать сообщение…'
                                            : 'Выберите диалог'
                                    }
                                />
                                <Button
                                    variant="default"
                                    size="icon"
                                    type="button"
                                    onClick={() => void sendMessage()}
                                    disabled={
                                        !canSend ||
                                        sending ||
                                        draft.trim() === ''
                                    }
                                    className="size-9 shrink-0 rounded-full"
                                >
                                    <Send className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    disabled
                                    className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Mic className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

            {actionMenuMsg ? (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setActionMenuMsg(null)}
                >
                    <div className="absolute inset-0 bg-black/40 animate-in fade-in" />
                    <div
                        className="absolute inset-x-0 bottom-0 space-y-1 rounded-t-2xl border-t border-sidebar-border bg-background p-2 pb-4 animate-in slide-in-from-bottom"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setReplyingTo(actionMenuMsg);
                                setActionMenuMsg(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-foreground hover:bg-muted"
                        >
                            <Reply className="size-5 text-muted-foreground" />
                            Ответить
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                void deleteMessage(actionMenuMsg.id);
                                setActionMenuMsg(null);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-600 hover:bg-red-500/10"
                        >
                            <Trash2 className="size-5" />
                            Удалить
                        </button>
                        <button
                            type="button"
                            onClick={() => setActionMenuMsg(null)}
                            className="mt-1 w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-muted-foreground hover:bg-muted"
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
