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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->string('value')->nullable();
            $table->foreignId('question_id')->constrained();
            $table->foreignId('entity_id')->constrained()->nullable();
            $table->foreignId('season_user_id')->constrained('season_user')->onDelete('cascade');
            $table->integer('order');
            $table->timestamps();
            
            $table->index(['question_id', 'order']);
            $table->index('entity_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
