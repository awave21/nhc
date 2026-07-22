import { Form, Head } from '@inertiajs/react';
import IntegrationsController from '@/actions/App/Http/Controllers/Settings/IntegrationsController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/integrations';

type Props = {
    openai: {
        has_key: boolean;
        masked_key: string | null;
    };
    status?: string;
};

export default function Integrations({ openai, status }: Props) {
    return (
        <>
            <Head title="Интеграции" />

            <h1 className="sr-only">Интеграции</h1>

            <div className="space-y-8">
                <Heading
                    variant="small"
                    title="OpenAI API"
                    description="Ключ используется агентом «Виктория» (Laravel AI SDK) и сервисом эмбеддингов для семантического поиска по базе знаний."
                />

                {openai.has_key && openai.masked_key ? (
                    <p className="text-sm text-muted-foreground">
                        Сейчас сохранён ключ:{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono">
                            {openai.masked_key}
                        </code>
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Ключ ещё не сохранён. Без ключа агент и векторный поиск
                        работать не будут.
                    </p>
                )}

                {status === 'openai-key-updated' && (
                    <div className="text-sm font-medium text-green-600">
                        Ключ сохранён.
                    </div>
                )}
                {status === 'openai-key-removed' && (
                    <div className="text-sm font-medium text-green-600">
                        Ключ удалён.
                    </div>
                )}

                <Form
                    {...IntegrationsController.update.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess={['openai_api_key']}
                    className="max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="openai_api_key">
                                    OpenAI API key
                                </Label>

                                <Input
                                    id="openai_api_key"
                                    name="openai_api_key"
                                    type="password"
                                    autoComplete="off"
                                    placeholder="sk-..."
                                    className="mt-1 block w-full font-mono"
                                />

                                <p className="text-xs text-muted-foreground">
                                    Хранится в БД в зашифрованном виде. Отправка
                                    пустого поля очистит сохранённый ключ.
                                </p>

                                <InputError
                                    className="mt-2"
                                    message={errors.openai_api_key}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} type="submit">
                                    Сохранить ключ
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {openai.has_key && (
                    <Form
                        {...IntegrationsController.destroy.form()}
                        options={{ preserveScroll: true }}
                        className="max-w-xl"
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                Удалить ключ
                            </Button>
                        )}
                    </Form>
                )}
            </div>
        </>
    );
}

Integrations.layout = {
    breadcrumbs: [
        {
            title: 'Интеграции',
            href: edit(),
        },
    ],
};
