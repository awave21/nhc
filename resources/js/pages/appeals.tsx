import { Head, Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { appeals as appealsRoute, dialogi } from '@/routes';
import { cn } from '@/lib/utils';

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

function rowSearchBlob(row: Record<string, unknown>, columns: string[]): string {
    return columns
        .map((c) => formatCell(row[c]).toLowerCase())
        .join('\u0000');
}

/**
 * Значение и тип query для ссылки «Диалог»:
 * сначала колонка из .env и режим, затем запасные имена полей;
 * если для режима ничего нет — пробуем другой идентификатор (username ↔ chat id).
 */
function resolveDialogLink(
    row: Record<string, unknown>,
    primaryColumn: string,
    preferredMatch: 'chat_id' | 'username',
): { raw: string; useUsernameQuery: boolean } | null {
    const usernameKeys = [
        primaryColumn,
        'tg_username',
        'username',
        'telegram_username',
        'telegram_user',
        'user_name',
    ];
    const chatIdKeys = [
        primaryColumn,
        'tg_chat_id',
        'telegram_chat_id',
        'chat_id',
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

    if (preferredMatch === 'username') {
        const u = pickFirst(usernameKeys);

        if (u !== undefined) {
            return { raw: String(u), useUsernameQuery: true };
        }

        const c = pickFirst(chatIdKeys);

        if (c !== undefined) {
            return { raw: String(c), useUsernameQuery: false };
        }
    } else {
        const c = pickFirst(chatIdKeys);

        if (c !== undefined) {
            return { raw: String(c), useUsernameQuery: false };
        }

        const u = pickFirst(usernameKeys);

        if (u !== undefined) {
            return { raw: String(u), useUsernameQuery: true };
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
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const q = search.trim().toLowerCase();

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

    const toggleSort = (key: string) => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');

            return;
        }

        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
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

            <div className="shadow-nhc rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
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
                            <TableHead className="w-[120px] text-right">
                                Диалог
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Нет строк
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((row, idx) => {
                                const link = resolveDialogLink(
                                    row,
                                    dialogLinkColumn,
                                    dialogLinkMatch,
                                );

                                return (
                                    <TableRow key={idx}>
                                        {columns.map((col) => (
                                            <TableCell
                                                key={col}
                                                className="max-w-[280px] truncate align-top font-mono text-xs"
                                                title={formatCell(row[col])}
                                            >
                                                {formatCell(row[col])}
                                            </TableCell>
                                        ))}
                                        <TableCell className="text-right align-top">
                                            {link ? (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link
                                                        href={dialogi({
                                                            query: link.useUsernameQuery
                                                                ? {
                                                                      username: link.raw,
                                                                  }
                                                                : {
                                                                      conversation:
                                                                          link.raw,
                                                                  },
                                                        })}
                                                    >
                                                        Открыть
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <span className="text-muted-foreground text-sm">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
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
