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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('course_id')->index();
            $table->string('name')->index();
            $table->string('slug')->unique();
            $table->string('city')->index();
            $table->string('state')->index();
            $table->string('country')->index();
            $table->geometry('location', subtype: 'point');
            $table->spatialIndex('location');
            $table->string('tee_time_service');
            $table->string('timezone');
            $table->boolean('is_simulator')->default(false);
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->unique(['course_id', 'tee_time_service']);
            $table->index(['name', 'city', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
