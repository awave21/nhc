import { router } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import handbooks from '@/routes/handbooks';
import { cn } from '@/lib/utils';

type Step = 'pick' | 'map' | 'edit';
type RawRow = Record<string, string>;
type EditableRow = { question: string; answer: string; included: boolean };

function guessColumn(headers: string[], candidates: string[]): string {
    const lower = headers.map((h) => h.trim().toLowerCase());
    for (const candidate of candidates) {
        const idx = lower.indexOf(candidate);
        if (idx !== -1) {
            return headers[idx];
        }
    }
    return '';
}

export default function ImportWizard({ handbookId }: { handbookId: number }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>('pick');
    const [fileName, setFileName] = useState('');
    const [parseError, setParseError] = useState('');
    const [headers, setHeaders] = useState<string[]>([]);
    const [rawRows, setRawRows] = useState<RawRow[]>([]);
    const [qCol, setQCol] = useState('');
    const [aCol, setACol] = useState('');
    const [rows, setRows] = useState<EditableRow[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reset = () => {
        setStep('pick');
        setFileName('');
        setParseError('');
        setHeaders([]);
        setRawRows([]);
        setQCol('');
        setACol('');
        setRows([]);
        setSubmitting(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            reset();
        }
        setOpen(next);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        setFileName(file.name);
        setParseError('');

        Papa.parse<RawRow>(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.replace(/^﻿/, '').trim(),
            complete: (result) => {
                const fields = (result.meta.fields ?? []).filter((f) => f.length > 0);
                if (fields.length === 0 || result.data.length === 0) {
                    setParseError('Не удалось распознать колонки или строки в файле.');
                    return;
                }
                setHeaders(fields);
                setRawRows(result.data);
                setQCol(guessColumn(fields, ['question', 'вопрос']));
                setACol(guessColumn(fields, ['answer', 'ответ']));
                setStep('map');
            },
            error: (err) => {
                setParseError(`Ошибка парсинга CSV: ${err.message}`);
            },
        });
    };

    const goToEdit = () => {
        if (!qCol || !aCol) {
            return;
        }
        const built: EditableRow[] = rawRows.map((r) => {
            const question = (r[qCol] ?? '').trim();
            const answer = (r[aCol] ?? '').trim();
            return {
                question,
                answer,
                included: question !== '' && answer !== '',
            };
        });
        setRows(built);
        setStep('edit');
    };

    const updateRow = (idx: number, patch: Partial<EditableRow>) => {
        setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
    };

    const removeRow = (idx: number) => {
        setRows((prev) => prev.filter((_, i) => i !== idx));
    };

    const includedCount = useMemo(() => rows.filter((r) => r.included).length, [rows]);

    const handleSubmit = () => {
        const items = rows
            .filter((r) => r.included)
            .map((r) => ({ question: r.question.trim(), answer: r.answer.trim() }))
            .filter((r) => r.question !== '' && r.answer !== '');

        if (items.length === 0) {
            return;
        }

        setSubmitting(true);
        router.post(
            handbooks.import(handbookId).url,
            { items },
            {
                preserveScroll: true,
                onSuccess: () => handleOpenChange(false),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="mr-1 h-4 w-4" />
                    Импорт CSV
                </Button>
            </DialogTrigger>
            <DialogContent
                className={cn(
                    'flex max-h-[85vh] flex-col',
                    step === 'edit' ? 'sm:max-w-5xl' : 'sm:max-w-2xl',
                )}
            >
                <DialogHeader>
                    <DialogTitle>Импорт из CSV</DialogTitle>
                    <DialogDescription>
                        {step === 'pick' && 'Выберите CSV-файл. Разделитель определится автоматически.'}
                        {step === 'map' && 'Сопоставьте колонки файла с полями «вопрос» и «ответ».'}
                        {step === 'edit' && 'Проверьте и при необходимости отредактируйте данные перед импортом.'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'pick' && (
                    <div className="space-y-3">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFileChange}
                        />
                        {fileName && !parseError && (
                            <p className="text-sm text-muted-foreground">Файл: {fileName}</p>
                        )}
                        {parseError && <p className="text-sm text-destructive">{parseError}</p>}
                    </div>
                )}

                {step === 'map' && (
                    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Колонка с вопросом</Label>
                                <Select value={qCol} onValueChange={setQCol}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите колонку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {headers.map((h) => (
                                            <SelectItem key={h} value={h}>{h}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Колонка с ответом</Label>
                                <Select value={aCol} onValueChange={setACol}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите колонку" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {headers.map((h) => (
                                            <SelectItem key={h} value={h}>{h}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {headers.map((h) => (
                                            <TableHead
                                                key={h}
                                                className={cn(
                                                    'whitespace-nowrap',
                                                    (h === qCol || h === aCol) && 'bg-primary/10 text-foreground',
                                                )}
                                            >
                                                {h}
                                                {h === qCol && ' (вопрос)'}
                                                {h === aCol && ' (ответ)'}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rawRows.slice(0, 5).map((r, i) => (
                                        <TableRow key={i}>
                                            {headers.map((h) => (
                                                <TableCell
                                                    key={h}
                                                    className={cn(
                                                        'max-w-xs truncate align-top text-xs',
                                                        (h === qCol || h === aCol) && 'bg-primary/5',
                                                    )}
                                                >
                                                    {r[h] ?? ''}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Всего строк в файле: {rawRows.length}. Показаны первые 5.
                        </p>
                    </div>
                )}

                {step === 'edit' && (
                    <div className="flex min-h-0 flex-1 flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            Будет импортировано: <span className="font-medium text-foreground">{includedCount}</span> из {rows.length}
                        </p>
                        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background">
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead className="w-2/5">Вопрос</TableHead>
                                        <TableHead>Ответ</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rows.map((r, i) => (
                                        <TableRow key={i} className={cn(!r.included && 'opacity-50')}>
                                            <TableCell className="align-top">
                                                <Checkbox
                                                    checked={r.included}
                                                    onCheckedChange={(v) => updateRow(i, { included: v === true })}
                                                />
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Input
                                                    value={r.question}
                                                    onChange={(e) => updateRow(i, { question: e.target.value })}
                                                />
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Textarea
                                                    value={r.answer}
                                                    onChange={(e) => updateRow(i, { answer: e.target.value })}
                                                    rows={2}
                                                />
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                    onClick={() => removeRow(i)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 'pick' && (
                        <Button variant="secondary" onClick={() => handleOpenChange(false)}>Отмена</Button>
                    )}
                    {step === 'map' && (
                        <>
                            <Button variant="secondary" onClick={() => setStep('pick')}>Назад</Button>
                            <Button onClick={goToEdit} disabled={!qCol || !aCol}>Далее</Button>
                        </>
                    )}
                    {step === 'edit' && (
                        <>
                            <Button variant="secondary" onClick={() => setStep('map')}>Назад</Button>
                            <Button onClick={handleSubmit} disabled={submitting || includedCount === 0}>
                                {submitting ? 'Импортируем…' : `Импортировать (${includedCount})`}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
