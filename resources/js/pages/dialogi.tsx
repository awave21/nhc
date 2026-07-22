import { Deferred, Head, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Home as ChatTemplateHome } from '@/components/blocks/chat-template';
import { mergeDialogiData } from '@/lib/merge-dialogi';
import { useDialogiRealtime } from '@/lib/use-dialogi-realtime';
import { dialogi } from '@/routes';
import dialogiRoutes from '@/routes/dialogi';
import type {
    DialogiConversation,
    DialogiMessage,
    DialogiPageProps,
} from '@/types/dialogi';

export default function Dialogi() {
    const page = usePage<DialogiPageProps>();
    const initialConversationId = page.props.initialConversationId ?? null;
    const initialUsername = page.props.initialUsername ?? null;
    const threadContextByConversation =
        page.props.threadContextByConversation ?? {};

    const [bundle, setBundle] = useState<{
        conversations: DialogiConversation[];
        messages: DialogiMessage[];
    }>({ conversations: [], messages: [] });
    const [nextOffset, setNextOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loadMorePending, setLoadMorePending] = useState(false);

    const {
        conversations: pConv,
        messages: pMsg,
        dialogsTruncated: pTruncated,
        dialogsNextOffset: pNextOff,
        loadError,
    } = page.props;

    useEffect(() => {
        if (pConv === undefined || pMsg === undefined) {
            return;
        }

        setBundle({ conversations: pConv, messages: pMsg });
        setNextOffset(pNextOff ?? 0);
        setHasMore(pTruncated ?? false);
    }, [pConv, pMsg, pNextOff, pTruncated]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loadMorePending) {
            return;
        }

        setLoadMorePending(true);

        try {
            const url = dialogiRoutes.more.url({
                query: { offset: nextOffset },
            });

            const response = await fetch(url, {
                credentials: 'same-origin',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data: {
                conversations?: DialogiConversation[];
                messages?: DialogiMessage[];
                nextOffset?: number;
                hasMore?: boolean;
                message?: string;
            } = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.message === 'string'
                        ? data.message
                        : 'Не удалось догрузить данные',
                );
            }

            if (!data.conversations || !data.messages) {
                throw new Error('Некорректный ответ сервера');
            }

            setBundle((b) =>
                mergeDialogiData(b, {
                    conversations: data.conversations ?? [],
                    messages: data.messages ?? [],
                }),
            );
            setNextOffset(
                typeof data.nextOffset === 'number' ? data.nextOffset : nextOffset,
            );
            setHasMore(Boolean(data.hasMore));
        } catch {
            // Ошибку можно позже вывести в toast; пока тихо снимаем loading
        } finally {
            setLoadMorePending(false);
        }
    }, [hasMore, loadMorePending, nextOffset]);

    const handleRealtimeInsert = useCallback((message: DialogiMessage) => {
        setBundle((b) => {
            if (b.messages.some((m) => m.id === message.id)) {
                return b;
            }

            return { ...b, messages: [...b.messages, message] };
        });
    }, []);

    useDialogiRealtime(page.props.realtime, handleRealtimeInsert);

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-neutral-50/50 md:-mb-2 dark:bg-neutral-950/50">
            <Head title="Диалоги" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Deferred
                    data={[
                        'conversations',
                        'messages',
                        'loadError',
                        'dialogsTruncated',
                        'dialogsNextOffset',
                    ]}
                    fallback={
                        <div className="flex h-full min-h-0 flex-1 items-center justify-center text-sm text-muted-foreground">
                            Загружаем диалоги…
                        </div>
                    }
                >
                    <ChatTemplateHome
                        conversations={bundle.conversations}
                        messages={bundle.messages}
                        loadError={loadError ?? null}
                        dialogsHasMore={hasMore}
                        loadMorePending={loadMorePending}
                        onLoadMore={hasMore ? loadMore : undefined}
                        initialConversationId={initialConversationId}
                        initialUsername={initialUsername}
                        threadContextByConversation={threadContextByConversation}
                        activeTakeovers={page.props.activeTakeovers ?? []}
                    />
                </Deferred>
            </div>
        </div>
    );
}

Dialogi.layout = {
    breadcrumbs: [
        {
            title: 'Диалоги',
            href: dialogi(),
        },
    ],
};
