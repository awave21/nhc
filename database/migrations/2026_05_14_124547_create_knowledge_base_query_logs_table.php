<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('knowledge_base_query_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_base_id')->nullable()->constrained()->nullOnDelete();
            $table->text('query');
            $table->json('results');
            $table->unsignedSmallInteger('result_count')->default(0);
            $table->timestamp('created_at')->useCurrent()->index();

            $table->index(['knowledge_base_id', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base_query_logs');
    }
};
