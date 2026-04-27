import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

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
import { dialogi, userProfiles as userProfilesRoute } from '@/routes';

export type UserProfilesPageProps = {
    profiles: Array<{
        username: string;
        description: string;
        entry_count: number;
    }>;
    loadError: string | null;
};

function SortIcon({
    column,
    sortKey,
    sortDir,
}: {
    column: string;
    sortKey: string | null;
    sortDir: 'asc' | 'desc';
}) {
    if (sortKey !== column) {
        return (
            <ArrowUpDown className="ml-1 inline size-3.5 opacity-40" aria-hidden />
        );
    }

    return sortDir === 'asc' ? (
        <ArrowUp className="ml-1 inline size-3.5" aria-hidden />
    ) : (
        <ArrowDown className="ml-1 inline size-3.5" aria-hidden />
    );
}

export default function UserProfiles({ profiles, loadError }: UserProfilesPageProps) {
    const page = usePage<UserProfilesPageProps>();
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState<'username' | 'entry_count' | null>('username');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [pickedUsername, setPickedUsername] = useState<string | null>(null);
    const [locationVersion, setLocationVersion] = useState(0);

    const profilesByUsername = useMemo(() => {
        const m = new Map<string, UserProfilesPageProps['profiles'][number]>();

        for (const p of profiles) {
            m.set(p.username, p);
        }

        return m;
    }, [profiles]);

    const profileFromUrl = useMemo(() => {
        void locationVersion;

        try {
            return new URL(page.url, 'http://localhost').searchParams.get('profile');
        } catch {
            return null;
        }
    }, [page.url, locationVersion]);

    const profileFromUrlValid =
        profileFromUrl !== null &&
        profileFromUrl !== '' &&
        profilesByUsername.has(profileFromUrl);

    const activeUsername =
        pickedUsername !== null
            ? pickedUsername
            : profileFromUrlValid
              ? profileFromUrl
              : null;

    const selectedProfile =
        activeUsername !== null ? profilesByUsername.get(activeUsername) ?? null : null;

    const q = search.trim().toLowerCase();

    const filtered = useMemo(() => {
        if (q === '') {
            return profiles;
        }

        return profiles.filter((p) => {
            const blob =
                `${p.username}\n${p.description}\n${String(p.entry_count)}`.toLowerCase();

            return blob.includes(q);
        });
    }, [profiles, q]);

    const sorted = useMemo(() => {
        if (!sortKey) {
            return filtered;
        }

        const dir = sortDir === 'asc' ? 1 : -1;
        const next = [...filtered];

        next.sort((a, b) => {
            if (sortKey === 'entry_count') {
                const d = dir * (a.entry_count - b.entry_count);

                return d !== 0 ? d : a.username.localeCompare(b.username, 'ru');
            }

            const sa = a.username.toLowerCase();
            const sb = b.username.toLowerCase();

            return dir * sa.localeCompare(sb, 'ru', { numeric: true });
        });

        return next;
    }, [filtered, sortKey, sortDir]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const onPopState = () => setLocationVersion((v) => v + 1);

        window.addEventListener('popstate', onPopState);

        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    const toggleSort = (key: 'username' | 'entry_count') => {
        if (sortKey !== key) {
            setSortKey(key);
            setSortDir('asc');

            return;
        }

        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    };

    const updateProfileQueryParam = (username: string | null) => {
        const nextUrl =
            username === null || username === ''
                ? userProfilesRoute.url()
                : userProfilesRoute.url({ query: { profile: username } });

        router.replace({
            url: nextUrl,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setLocationVersion((v) => v + 1),
        });
    };

    const selectProfile = (username: string) => {
        setPickedUsername(username);
        updateProfileQueryParam(username);
    };

    const hasDialogLink = (username: string) =>
        username !== '(без username)' && username.trim() !== '';

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
            <Head title="Профили пользователей" />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">Профили пользователей</h1>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                        Заметки из диалогов (таблица user_profile): по каждому нику агрегировано поле
                        description. Нажмите строку — справа откроется панель с полным текстом.
                    </p>
                </div>
                <div className="relative max-w-md flex-1">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Поиск по нику или тексту заметок…"
                        className={cn('pl-9')}
                        aria-label="Поиск"
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
                            <TableHead className="min-w-[200px]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="-ml-2 h-8 px-2 font-medium"
                                    onClick={() => toggleSort('username')}
                                >
                                    Ник (Telegram)
                                    <SortIcon column="username" sortKey={sortKey} sortDir={sortDir} />
                                </Button>
                            </TableHead>
                            <TableHead className="w-[120px] text-right">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="-mr-2 ml-auto flex h-8 px-2 font-medium"
                                    onClick={() => toggleSort('entry_count')}
                                >
                                    Записей
                                    <SortIcon column="entry_count" sortKey={sortKey} sortDir={sortDir} />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                    Нет профилей
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((row) => {
                                const isSelected =
                                    activeUsername !== null && row.username === activeUsername;

                                return (
                                    <TableRow
                                        key={row.username}
                                        className={cn(
                                            'cursor-pointer',
                                            isSelected &&
                                                'bg-primary/10 ring-1 ring-primary/40 ring-inset',
                                        )}
                                        onClick={() => selectProfile(row.username)}
                                    >
                                        <TableCell className="align-top font-mono text-xs">
                                            {row.username}
                                        </TableCell>
                                        <TableCell className="text-right align-top tabular-nums text-sm">
                                            {row.entry_count}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet
                open={selectedProfile !== null}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setPickedUsername(null);
                        updateProfileQueryParam(null);
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full min-h-0 flex-col sm:max-w-xl"
                >
                    <SheetHeader>
                        <SheetTitle>
                            {selectedProfile ? (
                                <>
                                    Профиль:{' '}
                                    <span className="font-mono text-base">{selectedProfile.username}</span>
                                </>
                            ) : (
                                'Профиль'
                            )}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex min-h-0 flex-1 flex-col px-4 pb-6">
                        {selectedProfile ? (
                            <>
                                <div className="text-muted-foreground mb-3 text-xs">
                                    Записей в журнале:{' '}
                                    <span className="tabular-nums">{selectedProfile.entry_count}</span>
                                </div>
                                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                    <p className="text-muted-foreground mb-1 text-xs font-medium">
                                        Сводное description
                                    </p>
                                    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                                        {selectedProfile.description === '' ? (
                                            <span className="text-muted-foreground">—</span>
                                        ) : (
                                            selectedProfile.description
                                        )}
                                    </div>
                                </div>
                                <div className="mt-auto shrink-0 border-t border-border/60 pt-4">
                                    {hasDialogLink(selectedProfile.username) ? (
                                        <div className="flex justify-center">
                                            <Button asChild className="w-1/2">
                                                <Link
                                                    href={dialogi({
                                                        query: {
                                                            username: selectedProfile.username.replace(
                                                                /^@/,
                                                                '',
                                                            ),
                                                        },
                                                    })}
                                                >
                                                    Открыть диалог
                                                </Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center text-sm">
                                            Для этого пользователя нет username — переход к диалогу недоступен.
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

UserProfiles.layout = {
    breadcrumbs: [
        {
            title: 'Профили пользователей',
            href: userProfilesRoute(),
        },
    ],
};
