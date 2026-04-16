import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Настройки оформления" />

            <h1 className="sr-only">Настройки оформления</h1>

            <div className="space-y-8">
                <Heading
                    variant="small"
                    title="Настройки оформления"
                    description="Обновите настройки внешнего вида вашего аккаунта"
                />
                <div className="max-w-xl">
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Настройки оформления',
            href: editAppearance(),
        },
    ],
};
