<?php

namespace App\Console\Commands;

use App\Jobs\GenerateItemEmbedding;
use App\Models\KnowledgeBase;
use App\Models\KnowledgeBaseItem;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('handbook:import-csv
    {file : Absolute path to the CSV file}
    {--name=База знаний : Knowledge base name (used when --kb is not provided)}
    {--kb= : Existing knowledge base id; if omitted, a new one is created}
    {--no-embed : Skip dispatching embedding jobs}')]
#[Description('Import a CSV of Q&A rows into a knowledge base (auto-detects question/answer columns).')]
class HandbookImportCsv extends Command
{
    public function handle(): int
    {
        $file = $this->argument('file');

        if (! is_file($file)) {
            $this->error("File not found: {$file}");

            return self::FAILURE;
        }

        $handle = fopen($file, 'r');
        if ($handle === false) {
            $this->error("Cannot open file: {$file}");

            return self::FAILURE;
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            $this->error('Empty CSV');
            fclose($handle);

            return self::FAILURE;
        }

        if (isset($header[0])) {
            $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);
        }

        $normalized = array_map(fn ($h) => strtolower(trim((string) $h)), $header);
        $qIdx = array_search('question', $normalized, true);
        $aIdx = array_search('answer', $normalized, true);

        if ($qIdx === false || $aIdx === false) {
            $this->error('CSV must contain "question" and "answer" columns. Found: '.implode(', ', $header));
            fclose($handle);

            return self::FAILURE;
        }

        $kb = $this->option('kb')
            ? KnowledgeBase::findOrFail($this->option('kb'))
            : KnowledgeBase::create(['name' => $this->option('name')]);

        $this->info("Importing into knowledge base #{$kb->id} «{$kb->name}»");

        $created = 0;
        $skipped = 0;
        $embedFailed = 0;
        $dispatch = ! $this->option('no-embed');

        while (($row = fgetcsv($handle)) !== false) {
            $question = trim((string) ($row[$qIdx] ?? ''));
            $answer = trim((string) ($row[$aIdx] ?? ''));

            if ($question === '' || $answer === '') {
                $skipped++;

                continue;
            }

            $item = KnowledgeBaseItem::create([
                'knowledge_base_id' => $kb->id,
                'question' => $question,
                'answer' => $answer,
            ]);

            $created++;

            if ($dispatch) {
                try {
                    GenerateItemEmbedding::dispatch($item);
                } catch (\Throwable $e) {
                    $embedFailed++;
                    $this->warn("Embedding failed for item #{$item->id} «{$question}»: {$e->getMessage()}");
                }
            }
        }

        fclose($handle);

        $this->info("Created: {$created}, skipped (empty Q/A): {$skipped}");

        if ($dispatch) {
            $this->info('Embedding jobs dispatched. Make sure your queue worker is running (or QUEUE_CONNECTION=sync to run inline).');
        }

        return self::SUCCESS;
    }
}
