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
        Schema::table('question_points', function (Blueprint $table) {
            $table->renameColumn('position', 'accuracy_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('question_points', function (Blueprint $table) {
            $table->renameColumn('accuracy_level', 'position');
        });
    }
};
