import { Head, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { Home as ChatTemplateHome } from '@/components/blocks/chat-template';
import { mergeDialogiData } from '@/lib/merge-dialogi';
import dialogiRoutes from '@/routes/dialogi';
import { dialogi } from '@/routes';
import type { DialogiPageProps } from '@/types/dialogi';

export default function Dialogi({
    conversations: initialConversations,
    messages: initialMessages,
    loadError,
    dialogsTruncated: initialTruncated,
    dialogsNextOffset: initialNextOffset,
}: DialogiPageProps) {
    const page = usePage<DialogiPageProps>();
    const initialConversationId = page.props.initialConversationId ?? null;
    const initialUsername = page.props.initialUsername ?? null;

    const [bundle, setBundle] = useState({
        conversations: initialConversations,
        messages: initialMessages,
    });
    const [nextOffset, setNextOffset] = useState(initialNextOffset);
    const [hasMore, setHasMore] = useState(initialTruncated);
    const [loadMorePending, setLoadMorePending] = useState(false);

    const {
        conversations: pConv,
        messages: pMsg,
        dialogsTruncated: pTruncated,
        dialogsNextOffset: pNextOff,
    } = page.props;

    useEffect(() => {
        setBundle({ conversations: pConv, messages: pMsg });
        setNextOffset(pNextOff);
        setHasMore(pTruncated);
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
                conversations?: DialogiPageProps['conversations'];
                messages?: DialogiPageProps['messages'];
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

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-neutral-50/50 md:-mb-2 dark:bg-neutral-950/50">
            <Head title="Диалоги" />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <ChatTemplateHome
                    conversations={bundle.conversations}
                    messages={bundle.messages}
                    loadError={loadError}
                    dialogsHasMore={hasMore}
                    loadMorePending={loadMorePending}
                    onLoadMore={hasMore ? loadMore : undefined}
                    initialConversationId={initialConversationId}
                    initialUsername={initialUsername}
                />
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
