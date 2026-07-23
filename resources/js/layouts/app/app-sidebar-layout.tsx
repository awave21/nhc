import { AppContent } from '@/components/app-content';
import { AppMobileNav } from '@/components/app-mobile-nav';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent
                variant="sidebar"
                className="flex max-h-svh flex-col overflow-hidden"
            >
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </div>
                <AppMobileNav />
            </AppContent>
        </AppShell>
    );
}
