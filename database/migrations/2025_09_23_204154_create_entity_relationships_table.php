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
        Schema::create('entity_relationships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_entity_id')->constrained('entities')->cascadeOnDelete();
            $table->foreignId('child_entity_id')->constrained('entities')->cascadeOnDelete();
            $table->string('relation_type'); // e.g. 'member_of', 'managed_by'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_relationships');
    }
};
