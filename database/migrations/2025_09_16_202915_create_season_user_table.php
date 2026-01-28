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
        Schema::create('season_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id')->constrained('seasons')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_host')->default(false);
            $table->string('nickname')->nullable();
            $table->timestamp('joined_at')->nullable();
            $table->float('percentage_complete')->default(0);
            $table->softDeletes();
            $table->timestamps();
            
            // Ensure a user can only be in a season once
            $table->unique(['season_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('season_user');
    }
};
