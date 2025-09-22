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
        // For MySQL, we need to alter the enum column to add the new value
        DB::statement("ALTER TABLE questions MODIFY COLUMN type ENUM('standing', 'text')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove the 'text' option from the enum
        DB::statement("ALTER TABLE questions MODIFY COLUMN type ENUM('standing')");
    }
};
