import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    ChevronRight,
    CircleCheck,
    CircleX,
    ExternalLink,
    Loader2,
    MapPin,
    Search,
    Tag,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { retreats as retreatsRoute } from '@/routes';
import retreatsTariffs from '@/routes/retreats';

type Tariff = {
    id: number | null;
    name: string;
    type: string | null;
    priceRub: number | null;
    priceUsd: number | null;
    status: boolean;
    externalUrl: string | null;
};

type Project = {
    id: string | null;
    name: string;
    status: string | null;
    isActive: boolean;
    city: string | null;
    date: string | null;
    type: string | null;
    externalUrl: string | null;
    activeTariffs: number;
    tariffs: Tariff[];
};

type RetreatsPageProps = {
    projects: Project[];
    loadError: string | null;
};

function formatDate(value: string | null): string | null {
    if (!value) {
        return null;
    }

    const d = new Date(value);

    if (Number.isNaN(d.getTime())) {
        return value;
    }

    return d.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatPrice(tariff: Tariff): string | null {
    if (tariff.priceRub != null) {
        return `${tariff.priceRub.toLocaleString('ru-RU')} ₽`;
    }

    if (tariff.priceUsd != null) {
        return `${tariff.priceUsd.toLocaleString('ru-RU')} $`;
    }

    return null;
}

function withTariffStatus(
    projects: Project[],
    tariffId: number,
    status: boolean,
): Project[] {
    return projects.map((project) => {
        if (!project.tariffs.some((tariff) => tariff.id === tariffId)) {
            return project;
        }

        const tariffs = project.tariffs.map((tariff) =>
            tariff.id === tariffId ? { ...tariff, status } : tariff,
        );

        return {
            ...project,
            activeTariffs: tariffs.filter((tariff) => tariff.status).length,
            tariffs,
        };
    });
}

function StatusBadge({
    active,
    disabled = false,
    onClick,
}: {
    active: boolean;
    disabled?: boolean;
    onClick?: () => void;
}) {
    const Icon = active ? CircleCheck : CircleX;

    return (
        <button
            type="button"
            disabled={disabled}
            aria-label={active ? 'Выключить тариф' : 'Включить тариф'}
            aria-pressed={active}
            onClick={onClick}
            className={cn(
                'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-60',
                active
                    ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:text-emerald-400'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
        >
            {disabled ? (
                <Loader2 className="size-3.5 animate-spin" />
            ) : (
                <Icon className="size-3.5" />
            )}
            {active ? 'Активен' : 'Неактивен'}
        </button>
    );
}

function ProjectMeta({ project }: { project: Project }) {
    const date = formatDate(project.date);

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {project.city ? (
                <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {project.city}
                </span>
            ) : null}
            {date ? (
                <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {date}
                </span>
            ) : null}
            {project.type ? (
                <span className="inline-flex items-center gap-1">
                    <Tag className="size-3.5" />
                    {project.type}
                </span>
            ) : null}
        </div>
    );
}

export default function Retreats({ projects, loadError }: RetreatsPageProps) {
    const [projectList, setProjectList] = useState(projects);
    const [search, setSearch] = useState('');
    const [onlyActive, setOnlyActive] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [updatingTariffId, setUpdatingTariffId] = useState<number | null>(
        null,
    );

    useEffect(() => {
        setProjectList(projects);
    }, [projects]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return projectList
            .filter((p) => !onlyActive || p.isActive)
            .filter((p) => {
                if (q === '') {
                    return true;
                }

                return (
                    p.name.toLowerCase().includes(q) ||
                    (p.city ?? '').toLowerCase().includes(q) ||
                    p.tariffs.some((t) => t.name.toLowerCase().includes(q))
                );
            });
    }, [projectList, search, onlyActive]);

    const selected = useMemo(
        () => filtered.find((p) => (p.id ?? 'orphan') === selectedId) ?? null,
        [filtered, selectedId],
    );

    const totalTariffs = projectList.reduce((n, p) => n + p.tariffs.length, 0);
    const totalActiveTariffs = projectList.reduce(
        (n, p) => n + p.activeTariffs,
        0,
    );
    const activeProjects = projectList.filter((p) => p.isActive).length;

    function toggleTariffStatus(
        tariffId: number | null,
        status: boolean,
    ): void {
        if (tariffId === null || updatingTariffId !== null) {
            return;
        }

        const nextStatus = !status;
        setUpdatingTariffId(tariffId);
        setProjectList((current) =>
            withTariffStatus(current, tariffId, nextStatus),
        );

        router.patch(
            retreatsTariffs.tariffs.status(tariffId).url,
            { status: nextStatus },
            {
                preserveScroll: true,
                preserveState: true,
                onError: () => {
                    setProjectList((current) =>
                        withTariffStatus(current, tariffId, status),
                    );
                    toast.error('Не удалось изменить статус тарифа');
                },
                onFinish: () => setUpdatingTariffId(null),
            },
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
            <Head title="Ретриты" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-foreground">
                        Ретриты и тарифы
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {projects.length} проектов ·{' '}
                        <span className="text-emerald-600 dark:text-emerald-400">
                            {activeProjects} активных
                        </span>{' '}
                        · {totalTariffs} тарифов ·{' '}
                        <span className="text-emerald-600 dark:text-emerald-400">
                            {totalActiveTariffs} активных тарифов
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск по проекту, городу, тарифу"
                            className="w-64 max-w-full pl-9"
                        />
                    </div>
                    <Button
                        type="button"
                        variant={onlyActive ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setOnlyActive((v) => !v)}
                    >
                        Только активные
                    </Button>
                </div>
            </div>

            {loadError ? (
                <Alert variant="destructive">
                    <AlertTitle>Не удалось загрузить ретриты</AlertTitle>
                    <AlertDescription>{loadError}</AlertDescription>
                </Alert>
            ) : null}

            {filtered.length === 0 && !loadError ? (
                <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
                    Ничего не найдено
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p, i) => {
                    const key = p.id ?? `orphan-${i}`;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedId(p.id ?? 'orphan')}
                            className="group flex flex-col gap-3 rounded-2xl border border-sidebar-border/60 bg-background p-4 text-left shadow-sm transition hover:border-emerald-500/40 hover:shadow-md dark:border-sidebar-border"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-medium text-foreground">
                                            {p.name}
                                        </p>
                                        {p.status ? (
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                                                    p.isActive
                                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-muted text-muted-foreground',
                                                )}
                                            >
                                                {p.status}
                                            </span>
                                        ) : null}
                                    </div>
                                    <div className="mt-1">
                                        <ProjectMeta project={p} />
                                    </div>
                                </div>
                                <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </div>

                            <div className="flex items-center gap-2 text-xs">
                                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">
                                    {p.tariffs.length} тарифов
                                </span>
                                {p.activeTariffs > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        {p.activeTariffs} активных
                                    </span>
                                ) : null}
                            </div>
                        </button>
                    );
                })}
            </div>

            <Sheet
                open={selected != null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedId(null);
                    }
                }}
            >
                <SheetContent
                    side="right"
                    className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
                >
                    {selected ? (
                        <>
                            <SheetHeader className="gap-2 border-b pr-12">
                                <div className="flex flex-wrap items-center gap-2">
                                    <SheetTitle className="text-base">
                                        {selected.name}
                                    </SheetTitle>
                                    {selected.status ? (
                                        <span
                                            className={cn(
                                                'rounded-full px-2 py-0.5 text-[11px] font-medium',
                                                selected.isActive
                                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-muted text-muted-foreground',
                                            )}
                                        >
                                            {selected.status}
                                        </span>
                                    ) : null}
                                </div>
                                <ProjectMeta project={selected} />
                                <SheetDescription className="sr-only">
                                    Тарифы проекта
                                </SheetDescription>
                                {selected.externalUrl ? (
                                    <a
                                        href={selected.externalUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        Открыть страницу
                                    </a>
                                ) : null}
                            </SheetHeader>

                            <ScrollArea className="min-h-0 flex-1">
                                <div className="flex flex-col gap-2 p-4">
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Тарифы · {selected.tariffs.length}
                                    </p>
                                    {selected.tariffs.map((t, ti) => {
                                        const price = formatPrice(t);

                                        return (
                                            <div
                                                key={t.id ?? `${t.name}-${ti}`}
                                                className={cn(
                                                    'flex flex-col gap-1.5 rounded-xl border p-3',
                                                    t.status
                                                        ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                                                        : 'border-sidebar-border/50 bg-muted/30',
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {t.name}
                                                    </p>
                                                    <StatusBadge
                                                        active={t.status}
                                                        disabled={
                                                            updatingTariffId ===
                                                            t.id
                                                        }
                                                        onClick={() =>
                                                            toggleTariffStatus(
                                                                t.id,
                                                                t.status,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    {t.type ? (
                                                        <span>{t.type}</span>
                                                    ) : null}
                                                    {price ? (
                                                        <span className="font-medium text-foreground">
                                                            {price}
                                                        </span>
                                                    ) : (
                                                        <span className="italic">
                                                            цена не указана
                                                        </span>
                                                    )}
                                                    {t.externalUrl ? (
                                                        <a
                                                            href={t.externalUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 text-emerald-600 hover:underline dark:text-emerald-400"
                                                        >
                                                            <ExternalLink className="size-3" />
                                                            ссылка
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </>
                    ) : null}
                </SheetContent>
            </Sheet>
        </div>
    );
}

Retreats.layout = {
    breadcrumbs: [
        {
            title: 'Ретриты',
            href: retreatsRoute(),
        },
    ],
};
