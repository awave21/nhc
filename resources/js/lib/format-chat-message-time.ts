/**
 * Время сообщения в стиле мессенджеров (локаль ru), календарь Europe/Moscow —
 * совпадает с типичным просмотром дат в Supabase/админке для РФ.
 * Сегодня — только «14:35», вчера — «вчера · 14:35», в этом году — «9 апр. · 14:35», иначе полная дата.
 */
const DIALOGI_DISPLAY_TIMEZONE = 'Europe/Moscow';

function calendarDateKey(d: Date, timeZone: string): string {
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(d);
}

function utcMidnightFromCalendarKey(key: string): number {
    const [y, m, d] = key.split('-').map((x) => Number.parseInt(x, 10));

    return Date.UTC(y, m - 1, d);
}

function yearInTimezone(d: Date, timeZone: string): number {
    return Number.parseInt(
        new Intl.DateTimeFormat('en', { timeZone, year: 'numeric' }).format(d),
        10,
    );
}

export function formatChatMessageTime(iso: string | null): string {
    if (!iso) {
        return '';
    }

    const d = new Date(iso);

    if (Number.isNaN(d.getTime())) {
        return '';
    }

    const tz = DIALOGI_DISPLAY_TIMEZONE;
    const now = new Date();

    const todayKey = calendarDateKey(now, tz);
    const msgKey = calendarDateKey(d, tz);
    const diffDays = Math.round(
        (utcMidnightFromCalendarKey(todayKey) -
            utcMidnightFromCalendarKey(msgKey)) /
            86_400_000,
    );

    const timeStr = d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: tz,
    });

    if (diffDays === 0) {
        return timeStr;
    }

    if (diffDays === 1) {
        return `вчера · ${timeStr}`;
    }

    if (yearInTimezone(d, tz) === yearInTimezone(now, tz)) {
        const datePart = d.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            timeZone: tz,
        });

        return `${datePart} · ${timeStr}`;
    }

    return d.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: tz,
    });
}
