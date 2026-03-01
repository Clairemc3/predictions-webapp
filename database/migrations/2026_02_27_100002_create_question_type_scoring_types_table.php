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
        Schema::create('question_type_scoring_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_type_id')->constrained('question_types')->cascadeOnDelete();
            $table->string('value', 100);
            $table->string('label');
            $table->text('description')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_type_scoring_types');
    }
};
