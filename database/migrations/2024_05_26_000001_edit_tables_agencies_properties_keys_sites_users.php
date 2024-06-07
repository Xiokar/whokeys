<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('agency_id')->after('site_id');
            $table->dropColumn('site_id');
        });
        
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn('mobile');
            $table->dropColumn('email');
            $table->dropColumn('key_limit');
        });
        
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('mobile')->after('postcode');
            $table->string('email')->after('mobile');
            $table->integer('key_limit')->nullable()->after('site_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->integer('site_id')->after('agency_id');
            $table->dropColumn('agency_id');
        });

        Schema::table('keys', function (Blueprint $table) {
            $table->dropColumn('agency_id');
        });
        
        Schema::table('sites', function (Blueprint $table) {
            $table->integer('key_limit')->nullable()->after('active');
        });
        
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropColumn('key_limit');
        });
    }
};
