import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    Menu,
    MessageCircle,
    MessageSquareWarning,
    Tent,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { appeals, dialogi, order, retreats } from '@/routes';

const items = [
    { title: 'Диалоги', href: dialogi(), path: dialogi.url(), icon: MessageCircle },
    { title: 'Заявки', href: order(), path: order.url(), icon: ClipboardList },
    {
        title: 'Обращения',
        href: appeals(),
        path: appeals.url(),
        icon: MessageSquareWarning,
    },
    { title: 'Ретриты', href: retreats(), path: retreats.url(), icon: Tent },
];

/**
 * Нижнее меню для мобильной версии: 4 основных раздела + «Ещё», которое
 * открывает полное боковое меню. На десктопе скрыто (используется сайдбар).
 */
export function AppMobileNav() {
    const { setOpenMobile } = useSidebar();
    const currentPath = usePage().url.split('?')[0];

    return (
        <nav
            style={{ paddingBottom: 'var(--app-bottom-inset)' }}
            className="flex shrink-0 items-stretch border-t border-sidebar-border/60 bg-background lg:hidden"
        >
            {items.map((item) => {
                const active = currentPath === item.path;

                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            'flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors',
                            active
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground',
                        )}
                    >
                        <item.icon className="size-5" />
                        <span className="leading-none">{item.title}</span>
                    </Link>
                );
            })}
            <button
                type="button"
                onClick={() => setOpenMobile(true)}
                className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
                <Menu className="size-5" />
                <span className="leading-none">Ещё</span>
            </button>
        </nav>
    );
}
