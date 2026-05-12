import { Form, Head, router, setLayoutProps } from '@inertiajs/react';
import { Check, Clock, Download, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import ImportWizard from '@/components/handbooks/import-wizard';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import HandbookItemController from '@/actions/App/Http/Controllers/Handbooks/HandbookItemController';
import handbooks from '@/routes/handbooks';
import { cn } from '@/lib/utils';

export type HandbookItem = {
    id: number;
    question: string;
    answer: string;
    created_at: string;
    has_embedding: boolean;
};

export type HandbookShowPageProps = {
    handbook: { id: number; name: string; description: string | null };
    items: HandbookItem[];
    stats: { total: number; with_embedding: number };
};

function EmbeddingBadge({ ready }: { ready: boolean }) {
    return ready ? (
        <span
            className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            title="Эмбеддинг сгенерирован"
        >
            <Check className="h-3 w-3" />
            Готово
        </span>
    ) : (
        <span
            className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
            title="Эмбеддинг генерируется"
        >
            <Clock className="h-3 w-3 animate-pulse" />
            В очереди
        </span>
    );
}

function AddItemDialog({ handbookId }: { handbookId: number }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить запись
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Новая запись</DialogTitle>
                    <DialogDescription>Добавьте вопрос и ответ. Эмбеддинг будет сгенерирован автоматически.</DialogDescription>
                </DialogHeader>
                <Form
                    {...HandbookItemController.store.form(handbookId)}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="add-question">Вопрос</Label>
                                <Input id="add-question" name="question" required autoFocus />
                                <InputError message={errors.question} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="add-answer">Ответ</Label>
                                <Textarea id="add-answer" name="answer" rows={6} required />
                                <InputError message={errors.answer} />
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="secondary" type="button">Отмена</Button>
                                </DialogClose>
                                <Button disabled={processing}>Добавить</Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteItemDialog({ item, handbookId }: { item: HandbookItem; handbookId: number }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить запись?</DialogTitle>
                    <DialogDescription className="line-clamp-2">{item.question}</DialogDescription>
                </DialogHeader>
                <Form
                    {...HandbookItemController.destroy.form({ knowledgeBase: handbookId, item: item.id })}
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

function DeleteBulkDialog({ handbookId, selectedIds, onSuccess }: { handbookId: number; selectedIds: number[]; onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const all = selectedIds.length === 0;

    const handleDelete = () => {
        const url = all
            ? HandbookItemController.destroyAll.url(handbookId)
            : HandbookItemController.destroyBulk.url(handbookId);
        router.delete(url, {
            data: all ? {} : { ids: selectedIds },
            preserveScroll: true,
            onSuccess: () => { setOpen(false); onSuccess(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="mr-1 h-4 w-4" />
                    {all ? 'Удалить все' : `Удалить (${selectedIds.length})`}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Удалить записи?</DialogTitle>
                    <DialogDescription>
                        {all
                            ? 'Будут удалены все записи справочника. Это действие нельзя отменить.'
                            : `Будет удалено ${selectedIds.length} записей. Это действие нельзя отменить.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary" type="button">Отмена</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>Удалить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function HandbookShow({ handbook, items, stats }: HandbookShowPageProps) {
    useEffect(() => {
        setLayoutProps({
            breadcrumbs: [
                { title: 'Справочники', href: handbooks.index() },
                { title: handbook.name, href: handbooks.show(handbook) },
            ],
        });
    }, [handbook]);

    const pending = stats.total - stats.with_embedding;

    useEffect(() => {
        if (pending === 0) {
            return;
        }
        const id = setInterval(() => {
            router.reload({ only: ['items', 'stats'], preserveScroll: true });
        }, 5000);
        return () => clearInterval(id);
    }, [pending]);

    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState<HandbookItem | null>(null);
    const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());

    const q = search.toLowerCase();
    const filtered = q
        ? items.filter((i) => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q))
        : items;

    const allChecked = filtered.length > 0 && filtered.every((i) => checkedIds.has(i.id));
    const someChecked = filtered.some((i) => checkedIds.has(i.id));

    const toggleAll = () => {
        if (allChecked) {
            setCheckedIds((prev) => { const next = new Set(prev); filtered.forEach((i) => next.delete(i.id)); return next; });
        } else {
            setCheckedIds((prev) => { const next = new Set(prev); filtered.forEach((i) => next.add(i.id)); return next; });
        }
    };

    const toggleOne = (id: number) => {
        setCheckedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    const selectedIds = useMemo(() => Array.from(checkedIds), [checkedIds]);

    return (
        <>
            <Head title={handbook.name} />
            <div className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-x-auto overflow-y-auto rounded-2xl bg-neutral-50/50 p-6 dark:bg-neutral-950/50">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading title={handbook.name} description={handbook.description ?? undefined} />
                    <div className="flex shrink-0 flex-wrap gap-2">
                        {(someChecked || items.length > 0) && (
                            <DeleteBulkDialog
                                handbookId={handbook.id}
                                selectedIds={someChecked ? selectedIds : []}
                                onSuccess={() => setCheckedIds(new Set())}
                            />
                        )}
                        <a
                            href={handbooks.export(handbook).url}
                            className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
                        >
                            <Download className="h-4 w-4" />
                            Экспорт CSV
                        </a>
                        <ImportWizard handbookId={handbook.id} />
                        <AddItemDialog handbookId={handbook.id} />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Поиск по вопросу или ответу..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {stats.total > 0 && (
                        <div className="text-sm text-muted-foreground">
                            Эмбеддинги:{' '}
                            <span className="font-medium text-foreground">
                                {stats.with_embedding} / {stats.total}
                            </span>
                            {pending > 0 && (
                                <span className="ml-1 inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                    <Clock className="h-3 w-3 animate-pulse" />
                                    {pending} в очереди
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="shadow-nhc min-w-0 overflow-x-auto rounded-2xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <Table className="min-w-[900px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        checked={allChecked}
                                        ref={(el) => { if (el) (el as HTMLButtonElement).dataset.indeterminate = String(someChecked && !allChecked); }}
                                        onCheckedChange={toggleAll}
                                        aria-label="Выбрать все"
                                    />
                                </TableHead>
                                <TableHead className="min-w-[280px]">Вопрос</TableHead>
                                <TableHead className="min-w-[320px]">Ответ</TableHead>
                                <TableHead className="w-32 whitespace-nowrap">Статус</TableHead>
                                <TableHead className="w-16" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                        {search ? 'Ничего не найдено' : 'Записей нет. Добавьте первую.'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item) => (
                                    <TableRow
                                        key={item.id}
                                        className={cn('cursor-pointer', selectedItem?.id === item.id && 'bg-primary/5', checkedIds.has(item.id) && 'bg-muted/40')}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()} className="align-top">
                                            <Checkbox
                                                checked={checkedIds.has(item.id)}
                                                onCheckedChange={() => toggleOne(item.id)}
                                                aria-label="Выбрать запись"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium align-top">{item.question}</TableCell>
                                        <TableCell className="text-muted-foreground align-top">
                                            <span className="line-clamp-2">{item.answer}</span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap align-top">
                                            <EmbeddingBadge ready={item.has_embedding} />
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="flex justify-end gap-1">
                                                <DeleteItemDialog item={item} handbookId={handbook.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Sheet open={selectedItem !== null} onOpenChange={(open) => { if (!open) { setSelectedItem(null); } }}>
                <SheetContent side="right" className="flex w-full min-h-0 flex-col sm:max-w-xl">
                    <SheetHeader>
                        <SheetTitle className="text-left">Редактирование записи</SheetTitle>
                    </SheetHeader>
                    {selectedItem && (
                        <Form
                            key={selectedItem.id}
                            {...HandbookItemController.update.form({ knowledgeBase: handbook.id, item: selectedItem.id })}
                            onSuccess={() => setSelectedItem(null)}
                            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`sheet-q-${selectedItem.id}`}>Вопрос</Label>
                                        <Textarea
                                            id={`sheet-q-${selectedItem.id}`}
                                            name="question"
                                            defaultValue={selectedItem.question}
                                            rows={2}
                                            required
                                        />
                                        <InputError message={errors.question} />
                                    </div>
                                    <div className="grid min-h-0 flex-1 gap-2">
                                        <Label htmlFor={`sheet-a-${selectedItem.id}`}>Ответ</Label>
                                        <Textarea
                                            id={`sheet-a-${selectedItem.id}`}
                                            name="answer"
                                            defaultValue={selectedItem.answer}
                                            className="min-h-[300px] flex-1"
                                            required
                                        />
                                        <InputError message={errors.answer} />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="secondary" onClick={() => setSelectedItem(null)}>
                                            Отмена
                                        </Button>
                                        <Button disabled={processing}>Сохранить</Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                </SheetContent>
            </Sheet>
        </>
    );
}

