<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->foreignId('question_type_id')->nullable()->after('base_type')->constrained('question_types');
        });

        DB::table('questions')->update([
            'question_type_id' => DB::raw(
                "(SELECT id FROM question_types WHERE question_types.`key` = questions.`type` AND question_types.application_context = 'uk_football' LIMIT 1)"
            ),
        ]);

        Schema::table('questions', function (Blueprint $table) {
            $table->foreignId('question_type_id')->nullable(false)->change();
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->string('type')->after('base_type')->nullable();
        });

        DB::table('questions')
            ->join('question_types', 'questions.question_type_id', '=', 'question_types.id')
            ->update(['questions.type' => DB::raw('question_types.`key`')]);

        Schema::table('questions', function (Blueprint $table) {
            $table->string('type')->nullable(false)->change();
        });

        Schema::table('questions', function (Blueprint $table) {
            $table->dropForeign(['question_type_id']);
            $table->dropColumn('question_type_id');
        });
    }
};
