<?php

require __DIR__ . '/auth.php';

use App\Http\Controllers\PropertyController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AgencyController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\KeyController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [HomeController::class, 'dashboard'])->name('dashboard');
    Route::post('/set-site', [HomeController::class, 'setSite'])->name('set-site');

    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile/information', [ProfileController::class, 'updateInformation'])->name('profile.update-information');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.update-password');

    Route::apiResource('users', UserController::class)->only('index', 'show');

    Route::resource('clients', ClientController::class);
    Route::resource('admins', AdminController::class);
    Route::resource('properties', PropertyController::class);
    Route::resource('sites', SiteController::class);
    Route::resource('agencies', AgencyController::class);

    Route::post('/join-agency', [ClientController::class, 'joinAgency'])->name('join-agency');
    Route::post('/clients/exists', [ClientController::class, 'exists'])->name('clients.exists');

    Route::resource('keys', KeyController::class)->except('create', 'store');
    Route::get('properties/{property}/keys/create', [KeyController::class, 'create'])->name('keys.create');
    Route::post('properties/{property}/keys', [KeyController::class, 'store'])->name('keys.store');

    Route::post('keys/find', [KeyController::class, 'find'])->name('keys.find');
    Route::get('keys/{key}/qrcode', [KeyController::class, 'qrcode'])->name('keys.qrcode');

    Route::get('keys/{key}/histories/create', [HistoryController::class, 'create'])->name('histories.create');
    Route::get('keys/{key}/histories/create-signature', [HistoryController::class, 'createSignature'])->name('histories.create-signature');
    Route::post('keys/{key}/histories', [HistoryController::class, 'store'])->name('histories.store');
    Route::post('keys/{key}/histories/manual', [HistoryController::class, 'manualStore'])->name('histories.manual-store');

    Route::post('keys/{key}/notes', [NoteController::class, 'store'])->name('notes.store');

    Route::delete('alerts/{alert}', [AlertController::class, 'destroy'])->name('alerts.destroy');
    Route::post('keys/{key}/alerts', [AlertController::class, 'store'])->name('alerts.store');
});
