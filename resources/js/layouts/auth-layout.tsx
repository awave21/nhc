import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { Head } from '@inertiajs/react';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-neutral-50 dark:bg-neutral-950">
            <Head title={title} />
            <AuthLayoutTemplate title={title} description={description}>
                {children}
            </AuthLayoutTemplate>
        </div>
    );
}
