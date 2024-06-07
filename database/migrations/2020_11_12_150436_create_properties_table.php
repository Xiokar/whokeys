<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('address');
            $table->string('address2')->nullable();
            $table->string('city');
            $table->string('postcode');
            $table->text('description');
            $table->text('first_name')->nullable();
            $table->text('last_name')->nullable();
            $table->text('mobile')->nullable();
            $table->foreignId('site_id')->index();
            $table->foreignId('user_id')->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('properties');
    }
}
