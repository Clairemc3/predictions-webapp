<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing 'standing' question types to 'ranking'
        DB::table('questions')
            ->where('type', 'standing')
            ->update(['type' => 'ranking']);

        // Update the enum column definition
        Schema::table('questions', function (Blueprint $table) {
            $table->enum('type', ['ranking', 'entity_selection'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Update existing 'ranking' question types back to 'standing'
        DB::table('questions')
            ->where('type', 'ranking')
            ->update(['type' => 'standing']);

        // Revert the enum column definition
        Schema::table('questions', function (Blueprint $table) {
            $table->enum('type', ['standing', 'entity_selection'])->change();
        });
    }
};
