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
        Schema::create('message_replies', function (Blueprint $table) {
            $table->id();
            // Telegram message_id отправленной реплики и того, на что она отвечает.
            $table->unsignedBigInteger('message_id')->unique();
            $table->unsignedBigInteger('reply_to_message_id');
            // Снимок исходного сообщения — чтобы восстанавливать цитату надёжно,
            // не завися от наличия/уникальности message_id в данных dialogs.
            $table->text('reply_to_content')->nullable();
            $table->string('reply_to_role')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_replies');
    }
};
