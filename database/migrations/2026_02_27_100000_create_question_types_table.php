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
        Schema::create('question_types', function (Blueprint $table) {
            $table->id();
            $table->string('application_context', 50);
            $table->string('key', 100);
            $table->enum('base_type', ['ranking', 'entity_selection']);
            $table->string('label');
            $table->text('short_description');
            $table->text('description');
            $table->foreignId('answer_category_id')->constrained('categories')->nullOnDelete();
            $table->string('answer_count_label')->nullable();
            $table->text('answer_count_helper_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->unique(['application_context', 'key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_types');
    }
};
