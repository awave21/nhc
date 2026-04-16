import {
    Brush,
    Camera,
    ChartBarIncreasing,
    CircleAlert,
    CircleOff,
    CircleUserRound,
    File,
    Image,
    ListFilter,
    MessageSquareDashed,
    MessageSquareDot,
    Mic,
    Paperclip,
    Phone,
    Search,
    Send,
    Smile,
    SquarePen,
    Star,
    User,
    UserRound,
    Users,
    Video,
} from 'lucide-react';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

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
import { formatChatMessageTime } from '@/lib/format-chat-message-time';
import { cn } from '@/lib/utils';
import type { DialogiConversation, DialogiMessage } from '@/types/dialogi';

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
    list: DialogiConversation[],
    initialConversationId: string | null | undefined,
    initialUsername: string | null | undefined,
): string {
    if (list.length === 0) {
        return '_default';
    }

    if (initialUsername) {
        const byName = conversationIdForUsername(list, initialUsername);

        if (byName) {
            return byName;
        }
    }

    if (
        initialConversationId &&
        list.some((c) => c.id === String(initialConversationId))
    ) {
        return String(initialConversationId);
    }

    return list[0].id;
}

export type ChatTemplateProps = {
    conversations: DialogiConversation[];
    messages: DialogiMessage[];
    loadError?: string | null;
    dialogsHasMore?: boolean;
    loadMorePending?: boolean;
    onLoadMore?: () => void;
    initialConversationId?: string | null;
    initialUsername?: string | null;
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
    conversations,
    messages,
    loadError,
    dialogsHasMore = false,
    loadMorePending = false,
    onLoadMore,
    initialConversationId = null,
    initialUsername = null,
}: ChatTemplateProps) => {
    const [selectedId, setSelectedId] = useState(() =>
        resolveInitialThreadId(
            conversations,
            initialConversationId,
            initialUsername,
        ),
    );
    const [search, setSearch] = useState('');
    const threadEndRef = useRef<HTMLDivElement>(null);
    const appliedInitialFromUrl = useRef(false);

    useEffect(() => {
        if (conversations.length === 0) {
            return;
        }

        if (!initialConversationId && !initialUsername) {
            appliedInitialFromUrl.current = true;

            return;
        }

        if (appliedInitialFromUrl.current) {
            return;
        }

        const next = resolveInitialThreadId(
            conversations,
            initialConversationId,
            initialUsername,
        );

        setSelectedId(next);
        appliedInitialFromUrl.current = true;
    }, [conversations, initialConversationId, initialUsername]);

    const activeConversationId = useMemo((): string => {
        if (conversations.length === 0) {
            return '_default';
        }

        if (conversations.some((c) => c.id === selectedId)) {
            return selectedId;
        }

        return conversations[0].id;
    }, [conversations, selectedId]);

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
        return messages
            .filter((m) => m.conversationId === activeConversationId)
            .slice()
            .sort(sortMessages);
    }, [messages, activeConversationId]);

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

                                    return (
                                        <button
                                            key={contact.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedId(contact.id)
                                            }
                                            className={cn(
                                                'flex w-full min-w-0 overflow-hidden rounded-xl px-3 py-2.5 text-left transition-[background-color,box-shadow]',
                                                'hover:bg-neutral-50/90 dark:hover:bg-neutral-800/50',
                                                'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
                                                isActive &&
                                                    'bg-sidebar-accent/70 shadow-sm dark:bg-sidebar-accent/50',
                                            )}
                                        >
                                            <div className="flex min-w-0 flex-1 flex-row items-start gap-3">
                                                <Avatar
                                                    className={cn(
                                                        'size-11 shrink-0 ring-offset-background',
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
                        <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border/50 px-4 dark:border-sidebar-border/80">
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Video className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Phone className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Search className="size-4" />
                                </Button>
                            </div>
                        </div>

                        <ScrollArea className="relative min-h-0 flex-1 bg-neutral-50/40 dark:bg-neutral-950/40">
                            <div className="flex flex-col gap-3 p-4">
                                {threadMessages.length === 0 ? (
                                    <div className="flex min-h-[12rem] items-center justify-center p-6 text-center text-sm leading-relaxed text-muted-foreground">
                                        Сообщения появятся здесь
                                    </div>
                                ) : (
                                    threadMessages.map((m) => {
                                        const timeLabel = formatChatMessageTime(
                                            m.createdAt,
                                        );

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
                                                    className={cn(
                                                        'flex max-w-[min(85%,28rem)] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm',
                                                        m.role === 'user'
                                                            ? 'bg-muted text-foreground'
                                                            : 'bg-primary/[0.14] text-foreground backdrop-blur-md dark:bg-primary/[0.2] dark:backdrop-blur-lg',
                                                    )}
                                                >
                                                    <ChatMessageMarkdown
                                                        content={m.content}
                                                        variant={
                                                            m.role === 'user'
                                                                ? 'user'
                                                                : 'agent'
                                                        }
                                                    />
                                                    {timeLabel ? (
                                                        <span className="self-end text-[11px] tracking-tight text-muted-foreground tabular-nums">
                                                            {timeLabel}
                                                        </span>
                                                    ) : null}
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
                            <div className="flex items-center gap-1 rounded-2xl border border-sidebar-border/60 bg-neutral-50/50 p-1.5 dark:border-sidebar-border dark:bg-neutral-900/40">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Smile className="size-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
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
                                    className="min-w-0 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
                                    placeholder="Сообщение…"
                                />
                                <Button
                                    variant="default"
                                    size="icon"
                                    className="size-9 shrink-0 rounded-full"
                                >
                                    <Send className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
                                >
                                    <Mic className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};
