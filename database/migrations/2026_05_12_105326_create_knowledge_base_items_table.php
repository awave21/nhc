<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('knowledge_base_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_base_id')->constrained()->cascadeOnDelete();
            $table->text('question');
            $table->text('answer');
            $table->timestamps();
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE knowledge_base_items ADD COLUMN embedding vector(1536)');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base_items');
    }
};
