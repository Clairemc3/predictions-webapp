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
        Schema::create('question_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('questions')->onDelete('cascade');
            $table->unsignedInteger('position'); // Standing/rank position
            $table->string('result')->nullable(); // Result description/value
            $table->foreignId('entity_id')->constrained('entities')->onDelete('cascade');
            $table->timestamps();

            // Ensure unique position per question
            $table->unique(['question_id', 'position']);
            // Index for query performance
            $table->index('question_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_results');
    }
};
