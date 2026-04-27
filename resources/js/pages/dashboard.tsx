import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { appeals, dashboard, dialogi, order } from '@/routes';

export type DashboardStat = {
    count: number | null;
    error: string | null;
};

export type DashboardPageProps = {
    stats: {
        dialogs: DashboardStat;
        orders: DashboardStat;
        appeals: DashboardStat;
    };
};

function formatCount(value: number | null): string {
    if (value === null) {
        return '—';
    }

    return value.toLocaleString('ru-RU');
}

export default function Dashboard({ stats }: DashboardPageProps) {
    const blocks = [
        {
            key: 'dialogs',
            title: 'Диалоги',
            stat: stats.dialogs,
            href: dialogi().url,
        },
        {
            key: 'orders',
            title: 'Заявки',
            stat: stats.orders,
            href: order().url,
        },
        {
            key: 'appeals',
            title: 'Обращения',
            stat: stats.appeals,
            href: appeals().url,
        },
    ] as const;

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
            <Head title="Панель управления" />
            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                {blocks.map(({ key, title, stat, href }) => (
                    <Link
                        key={key}
                        href={href}
                        className="shadow-nhc relative aspect-video overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background transition-colors hover:bg-neutral-50/50 dark:border-sidebar-border dark:hover:bg-neutral-900/50"
                    >
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                        <div className="relative flex h-full flex-col justify-between p-6">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</h3>
                                <p className="text-3xl font-semibold tabular-nums tracking-tight">
                                    {formatCount(stat.count)}
                                </p>
                            </div>
                            {stat.error ? (
                                <p className="text-destructive text-xs leading-snug">{stat.error}</p>
                            ) : (
                                <div className="text-primary flex items-center gap-1 text-sm font-medium">
                                    Перейти
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
            <div className="shadow-nhc relative min-h-[min(24rem,50dvh)] flex-1 overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Панель управления',
            href: dashboard(),
        },
    ],
};
