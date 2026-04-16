import type { DialogiConversation, DialogiMessage } from '@/types/dialogi';
import { compareDialogiInstants } from '@/lib/compare-dialogi-instants';

type Bundle = {
    conversations: DialogiConversation[];
    messages: DialogiMessage[];
};

/**
 * Объединяет данные от /dialogi/more с уже загруженными (дедуп по id).
 */
export function mergeDialogiData(base: Bundle, incoming: Bundle): Bundle {
    const convMap = new Map<string, DialogiConversation>();

    for (const c of base.conversations) {
        convMap.set(c.id, c);
    }

    for (const c of incoming.conversations) {
        const existing = convMap.get(c.id);

        if (
            !existing ||
            compareDialogiInstants(c.lastMessageAt, existing.lastMessageAt) > 0
        ) {
            convMap.set(c.id, c);
        }
    }

    const conversations = [...convMap.values()].sort((a, b) =>
        compareDialogiInstants(b.lastMessageAt, a.lastMessageAt),
    );

    const msgMap = new Map<string, DialogiMessage>();

    for (const m of base.messages) {
        msgMap.set(m.id, m);
    }

    for (const m of incoming.messages) {
        msgMap.set(m.id, m);
    }

    const messages = [...msgMap.values()].sort((a, b) => {
        const byTime = compareDialogiInstants(a.createdAt, b.createdAt);

        if (byTime !== 0) {
            return byTime;
        }

        return a.id.localeCompare(b.id);
    });

    return { conversations, messages };
}
