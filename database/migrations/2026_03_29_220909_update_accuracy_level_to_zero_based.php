<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update all existing accuracy_level values to be 0-based instead of 1-based
        // (1 becomes 0, 2 becomes 1, etc.)
        DB::table('question_points')->update([
            'accuracy_level' => DB::raw('accuracy_level - 1'),
        ]);

        // Update the default value to 0
        Schema::table('question_points', function (Blueprint $table) {
            $table->unsignedInteger('accuracy_level')->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to 1-based
        DB::table('question_points')->update([
            'accuracy_level' => DB::raw('accuracy_level + 1'),
        ]);

        Schema::table('question_points', function (Blueprint $table) {
            $table->unsignedInteger('accuracy_level')->default(1)->change();
        });
    }
};
