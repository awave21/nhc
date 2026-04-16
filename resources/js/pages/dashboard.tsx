import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <div className="flex h-full min-h-0 flex-1 flex-col gap-6 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
            <Head title="Панель управления" />
            <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                <div className="shadow-nhc relative aspect-video overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>
                <div className="shadow-nhc relative aspect-video overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>
                <div className="shadow-nhc relative aspect-video overflow-hidden rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                </div>
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
