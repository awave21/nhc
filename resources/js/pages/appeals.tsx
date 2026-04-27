import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { appeals as appealsRoute, dialogi } from '@/routes';

export type AppealsPageProps = {
    columns: string[];
    rows: Record<string, unknown>[];
    loadError: string | null;
    dialogLinkColumn: string;
    /** chat_id → ?conversation= ; username → ?username= (как title беседы) */
    dialogLinkMatch: 'chat_id' | 'username';
};

function formatCell(value: unknown): string {
    if (value === null || value === undefined) {
        return '';
    }

    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }

    return String(value);
}

const isoDateTimeLike = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

/**
 * Человекочитаемое отображение: ISO-даты/время → Москва (Europe/Moscow).
 * Сортировка и поиск используют {@link formatCell} без преобразований.
 */
function formatDisplayCell(value: unknown): string {
    if (typeof value !== 'string') {
        return formatCell(value);
    }

    const trimmed = value.trim();

    if (trimmed === '' || !isoDateTimeLike.test(trimmed)) {
        return formatCell(value);
    }

    const parsed = Date.parse(trimmed);

    if (Number.isNaN(parsed)) {
        return formatCell(value);
    }

    return new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(parsed));
}

function rowPrimaryId(row: Record<string, unknown>): string {
    const v = row['id'];

    if (v === null || v === undefined) {
        return '';
    }

    return String(v);
}

function normalizeTelegramUsername(value: string): string | null {
    const trimmed = value.trim();

    if (trimmed === '') {
        return null;
    }

    const withoutAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;

    if (!/^[a-zA-Z0-9_]{5,}$/.test(withoutAt)) {
        return null;
    }

    return withoutAt;
}

function isTelegramUsernameColumn(column: string): boolean {
    return [
        'tg_username',
        'username',
        'telegram_username',
        'telegram_user',
        'user_name',
    ].includes(column);
}

function shouldHideAppealsSheetField(column: string, value: unknown): boolean {
    if (column.trim().toLowerCase() !== 'status') {
        return false;
    }

    if (typeof value === 'boolean') {
        return value === true;
    }

    if (typeof value === 'string') {
        return value.trim().toLowerCase() === 'true';
    }

    if (typeof value === 'number') {
        return value === 1;
    }

    return false;
}

function rowSearchBlob(row: Record<string, unknown>, columns: string[]): string {
    return columns
        .map((c) => formatCell(row[c]).toLowerCase())
        .join('\u0000');
}

/**
 * Значение и тип query для ссылки «Диалог»:
 * сначала «канонические» поля выбранного режима, затем колонка из .env как fallback;
 * если для режима ничего нет — пробуем другой идентификатор (username ↔ chat id).
 */
function resolveDialogLink(
    row: Record<string, unknown>,
    primaryColumn: string,
    preferredMatch: 'chat_id' | 'username',
): { conversation?: string; username?: string } | null {
    /**
     * Важно: `primaryColumn` из .env может указывать не на тот тип идентификатора.
     * Поэтому сначала пробуем «канонические» поля режима, и только затем primaryColumn
     * (как fallback), чтобы `?conversation=` всегда предпочитал tg_chat_id и т.п.
     */
    const usernameKeys = [
        'tg_username',
        'username',
        'telegram_username',
        'telegram_user',
        'user_name',
        primaryColumn,
    ];
    const chatIdKeys = [
        'tg_chat_id',
        'telegram_chat_id',
        'chat_id',
        primaryColumn,
    ];

    const pickFirst = (keys: string[]): unknown => {
        const seen = new Set<string>();

        for (const key of keys) {
            if (seen.has(key)) {
                continue;
            }

            seen.add(key);

            if (!Object.prototype.hasOwnProperty.call(row, key)) {
                continue;
            }

            const v = row[key];

            if (v !== null && v !== undefined && String(v).trim() !== '') {
                return v;
            }
        }

        return undefined;
    };

    const conversation = pickFirst(chatIdKeys);
    const username = pickFirst(usernameKeys);

    if (preferredMatch === 'username') {
        if (username !== undefined || conversation !== undefined) {
            return {
                conversation:
                    conversation !== undefined ? String(conversation) : undefined,
                username: username !== undefined ? String(username) : undefined,
            };
        }
    } else {
        if (conversation !== undefined || username !== undefined) {
            return {
                conversation:
                    conversation !== undefined ? String(conversation) : undefined,
                username: username !== undefined ? String(username) : undefined,
            };
        }
    }

    return null;
}

export default function Appeals({
    columns,
    rows,
    loadError,
    dialogLinkColumn,
    dialogLinkMatch,
}: AppealsPageProps) {
    const page = usePage<AppealsPageProps>();
    const highlightRef = useRef<HTMLTableRowElement>(null);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [pickedRowId, setPickedRowId] = useState<string | null>(null);
    const [locationVersion, setLocationVersion] = useState(0);
    /**
     * Inertia `router.replace` обновляет URL не синхронно: до onSuccess `?row=` ещё
     * читается из window — шит снова открывается. Флаг гасит выбор до onSuccess;
     * сбрасываем в onSuccess при снятии `row` из URL (без setState в эффекте).
     */
    const [sheetSuppressUntilUrlCleared, setSheetSuppressUntilUrlCleared] =
        useState(false);

    /**
     * Используем page.url от Inertia как единственный источник истины.
     * window.location.href может обновляться асинхронно относительно Inertia-контекста,
     * что приводило к race-condition: шит снова открывался после закрытия.
     */
    const highlightRowId = useMemo(() => {
        void locationVersion;

        try {
            return new URL(page.url, 'http://localhost').searchParams.get('row');
        } catch {
            return null;
        }
    }, [page.url, locationVersion]);

    const q = search.trim().toLowerCase();
    const rowsById = useMemo(() => {
        const map = new Map<string, Record<string, unknown>>();

        for (const row of rows) {
            const rowId = rowPrimaryId(row);

            if (rowId !== '') {
                map.set(rowId, row);
            }
        }

        return map;
    }, [rows]);

    const rowIdFromUrl = useMemo(() => {
        if (!highlightRowId || !rowsById.has(highlightRowId)) {
            return null;
        }

        return highlightRowId;
    }, [highlightRowId, rowsById]);

    const activeRowId =
        sheetSuppressUntilUrlCleared && highlightRowId !== null
            ? null
            : (pickedRowId ?? rowIdFromUrl);

    const filtered = useMemo(() => {
        if (q === '') {
            return rows;
        }

        return rows.filter((row) => rowSearchBlob(row, columns).includes(q));
    }, [rows, columns, q]);

    const sorted = useMemo(() => {
        if (!sortKey || !columns.includes(sortKey)) {
            return filtered;
        }

        const dir = sortDir === 'asc' ? 1 : -1;
        const next = [...filtered];

        next.sort((a, b) => {
            const sa = formatCell(a[sortKey]).toLowerCase();
            const sb = formatCell(b[sortKey]).toLowerCase();

            return dir * sa.localeCompare(sb, 'ru', { numeric: true });
        });

        return next;
    }, [filtered, sortKey, sortDir, columns]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const onPopState = () => {
            setLocationVersion((v) => v + 1);
        };

        window.addEventListener('popstate', onPopState);

        return () => {
            window.removeEventListener('popstate', onPopState);
        };
    }, []);

    useEffect(() => {
        if (!highlightRowId || !highlightRef.current) {
            return;
        }

        highlightRef.current.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
        });
    }, [highlightRowId, sorted]);

    const selectedRow = useMemo(() => {
        if (!activeRowId) {
            return null;
        }

        return rowsById.get(activeRowId) ?? null;
    }, [rowsById, activeRowId]);
    const selectedRowDialogLink = useMemo(() => {
        if (!selectedRow) {
            return null;
        }

        return resolveDialogLink(selectedRow, dialogLinkColumn, dialogLinkMatch);
    }, [selectedRow, dialogLinkColumn, dialogLinkMatch]);

    const toggleSort = (key: string) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');

            return;
        }

        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    };

    const updateRowQueryParam = (rowId: string | null) => {
        const nextUrl =
            rowId === null || rowId === ''
                ? appealsRoute.url()
                : appealsRoute.url({ query: { row: rowId } });

        const clearingRow = rowId === null || rowId === '';

        router.replace({
            url: nextUrl,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setLocationVersion((v) => v + 1);

                if (clearingRow) {
                    setSheetSuppressUntilUrlCleared(false);
                }
            },
        });
    };

    const selectRow = (rowId: string) => {
        if (rowId === '') {
            return;
        }

        setSheetSuppressUntilUrlCleared(false);
        setPickedRowId(rowId);
        updateRowQueryParam(rowId);
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortKey !== column) {
            return (
                <ArrowUpDown
                    className="ml-1 inline size-3.5 opacity-40"
                    aria-hidden
                />
            );
        }

        return sortDir === 'asc' ? (
            <ArrowUp className="ml-1 inline size-3.5" aria-hidden />
        ) : (
            <ArrowDown className="ml-1 inline size-3.5" aria-hidden />
        );
    };

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
            <Head title="Обращения" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-xl font-semibold tracking-tight">Обращения</h1>
                <div className="relative max-w-md flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по всем столбцам…"
                        className={cn('pl-9')}
                        aria-label="Поиск по таблице"
                    />
                </div>
            </div>

            {loadError ? (
                <Alert variant="destructive">
                    <AlertTitle>Не удалось загрузить данные</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            ) : null}

            <div className="shadow-nhc min-w-0 overflow-x-auto rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col}>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="-ml-2 h-8 px-2 font-medium"
                                        onClick={() => toggleSort(col)}
                                    >
                                        {col}
                                        <SortIcon column={col} />
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Нет строк
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((row, idx) => {
                                const rid = rowPrimaryId(row);
                                const isHighlighted =
                                    highlightRowId !== null &&
                                    rid !== '' &&
                                    rid === highlightRowId;
                                const isSelected = rid !== '' && rid === activeRowId;

                                return (
                                    <TableRow
                                        key={idx}
                                        ref={
                                            isHighlighted
                                                ? highlightRef
                                                : undefined
                                        }
                                        className={cn(
                                            'cursor-pointer',
                                            isHighlighted &&
                                                'bg-primary/10 ring-2 ring-primary/25 ring-inset',
                                            isSelected &&
                                                'bg-primary/10 ring-1 ring-primary/40 ring-inset',
                                        )}
                                        onClick={() => selectRow(rid)}
                                    >
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col}
                                                className="max-w-[280px] truncate align-top font-mono text-xs"
                                                title={formatDisplayCell(row[col])}
                                            >
                                                {formatDisplayCell(row[col])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet
                open={selectedRow !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setSheetSuppressUntilUrlCleared(true);
                        setPickedRowId(null);
                        updateRowQueryParam(null);
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full min-h-0 flex-col sm:max-w-xl"
                >
                    <SheetHeader>
                        <SheetTitle>Подробная информация</SheetTitle>
                    </SheetHeader>
                    <div className="flex min-h-0 flex-1 flex-col px-4 pb-6">
                        {selectedRow ? (
                            <>
                                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                                    {columns
                                        .filter(
                                            (col) =>
                                                !shouldHideAppealsSheetField(
                                                    col,
                                                    selectedRow[col],
                                                ),
                                        )
                                        .map((col) => (
                                        <div
                                            key={col}
                                            className="space-y-1 border-b border-border/60 pb-2 last:border-b-0"
                                        >
                                            {(() => {
                                                const rawCell = formatCell(
                                                    selectedRow[col],
                                                );
                                                const displayCell =
                                                    formatDisplayCell(selectedRow[col]);
                                                const tgUsername = isTelegramUsernameColumn(
                                                    col,
                                                )
                                                    ? normalizeTelegramUsername(
                                                          rawCell,
                                                      )
                                                    : null;

                                                return (
                                                    <>
                                                        <p className="text-muted-foreground text-xs font-medium">
                                                            {col}
                                                        </p>
                                                        <p className="break-words font-mono text-xs">
                                                            {tgUsername ? (
                                                                <a
                                                                    href={`https://t.me/${tgUsername}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-primary underline underline-offset-2"
                                                                >
                                                                    {rawCell}
                                                                </a>
                                                            ) : (
                                                                displayCell || '—'
                                                            )}
                                                        </p>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-auto shrink-0 border-t border-border/60 pt-4">
                                    {selectedRowDialogLink ? (
                                        <div className="flex justify-center">
                                            <Button asChild className="w-1/2">
                                                <Link
                                                    href={dialogi({
                                                        query: {
                                                            ...(selectedRowDialogLink.conversation
                                                                ? {
                                                                      conversation:
                                                                          selectedRowDialogLink.conversation,
                                                                  }
                                                                : {}),
                                                            ...(selectedRowDialogLink.username
                                                                ? {
                                                                      username:
                                                                          selectedRowDialogLink.username,
                                                                  }
                                                                : {}),
                                                        },
                                                    })}
                                                >
                                                    Открыть диалог
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center text-sm">
                                            Для этой записи не найден идентификатор
                                            диалога.
                                        </p>
                                    )}
                                </div>
                            </>
                        ) : null}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

Appeals.layout = {
    breadcrumbs: [
        {
            title: 'Обращения',
            href: appealsRoute(),
        },
    ],
};
