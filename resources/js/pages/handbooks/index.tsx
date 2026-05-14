import { Form, Head, router } from '@inertiajs/react';
import { Database, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import HandbookController from '@/actions/App/Http/Controllers/Handbooks/HandbookController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import handbooks from '@/routes/handbooks';

export type Handbook = {
    id: number;
    name: string;
    description: string | null;
    items_count: number;
};

export type HandbooksPageProps = {
    handbooks: Handbook[];
};

function CreateDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить справочник
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Новый справочник</DialogTitle>
                    <DialogDescription>Введите название и описание справочника.</DialogDescription>
                </DialogHeader>
                <Form
                    {...HandbookController.store.form()}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Название</Label>
                                <Input id="name" name="name" required autoFocus />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea id="description" name="description" rows={3} />
                                <InputError message={errors.description} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary" type="button">Отмена</Button>
                                </DialogClose>
                                <Button disabled={processing}>Создать</Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditDialog({ handbook }: { handbook: Handbook }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Редактировать справочник</DialogTitle>
                </DialogHeader>
                <Form
                    {...HandbookController.update.form(handbook)}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor={`name-${handbook.id}`}>Название</Label>
                                <Input id={`name-${handbook.id}`} name="name" defaultValue={handbook.name} required />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor={`desc-${handbook.id}`}>Описание</Label>
                                <Textarea id={`desc-${handbook.id}`} name="description" defaultValue={handbook.description ?? ''} rows={3} />
                                <InputError message={errors.description} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary" type="button">Отмена</Button>
                                </DialogClose>
                                <Button disabled={processing}>Сохранить</Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteDialog({ handbook }: { handbook: Handbook }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить справочник</DialogTitle>
                    <DialogDescription>
                        Удалить «{handbook.name}»? Все вопросы и ответы будут удалены безвозвратно.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...HandbookController.destroy.form(handbook)}
                    onSuccess={() => setOpen(false)}
                >
                    {({ processing }) => (
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="secondary" type="button">Отмена</Button>
                            </DialogClose>
                            <Button variant="destructive" disabled={processing}>Удалить</Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default function HandbooksIndex({ handbooks: handbooksList }: HandbooksPageProps) {
    return (
        <>
            <Head title="Справочники" />
            <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
                <div className="flex items-center justify-between">
                    <Heading title="Справочники" description="Базы знаний с вопросами и ответами" />
                    <CreateDialog />
                </div>

                {handbooksList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                        <Database className="h-12 w-12 opacity-30" />
                        <p>Справочников пока нет. Создайте первый.</p>
                    </div>
                ) : (
                    <div className="shadow-nhc min-w-0 overflow-x-auto rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Описание</TableHead>
                                    <TableHead className="text-right">Записей</TableHead>
                                    <TableHead className="w-24" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {handbooksList.map((handbook) => (
                                    <TableRow
                                        key={handbook.id}
                                        onClick={() => router.visit(handbooks.show(handbook).url)}
                                        className="cursor-pointer hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">{handbook.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {handbook.description ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-right tabular-nums">
                                            {handbook.items_count}
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <EditDialog handbook={handbook} />
                                                <DeleteDialog handbook={handbook} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

HandbooksIndex.layout = {
    breadcrumbs: [{ title: 'Справочники', href: handbooks.index() }],
};
