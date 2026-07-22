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
        Schema::create('dialog_takeovers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tg_chat_id')->unique();
            $table->foreignId('manager_id')->nullable()->constrained('app_users')->nullOnDelete();
            $table->timestamp('active_until')->nullable();
            $table->timestamps();

            $table->index('active_until');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dialog_takeovers');
    }
};
