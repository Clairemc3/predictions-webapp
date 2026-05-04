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
        Schema::table('question_types', function (Blueprint $table) {
            $table->unsignedInteger('fixed_answer_count')->nullable()->after('answer_count_helper_text');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_types', function (Blueprint $table) {
            $table->dropColumn('fixed_answer_count');
        });
    }
};
