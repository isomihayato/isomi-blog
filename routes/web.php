<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ArticleAdTemplateController;
use App\Http\Controllers\ArticleAdController;
use App\Http\Controllers\MembersController;
use App\Models\Member;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [FrontController::class, 'index'])->name('fronts.index');
Route::get('/articles/details/{id}', [FrontController::class, 'article'])->name('fronts.article');
Route::get('/member/login', [FrontController::class, 'login'])->name('fronts.login');
Route::post('/members', [MembersController::class, 'store'])->name('members.store');
// Route::resources('articles', 'ArticleController', ['except' => ['show']])->middleware(['auth', 'verified']);
Route::resource('articles', ArticleController::class)->middleware(['auth', 'verified']);
Route::post('/articles/update/{id}', [ArticleController::class, 'update_article'])->middleware(['auth', 'verified']);
Route::post('/articles/uploadImg', [ArticleController::class, 'uploadImg'])->middleware(['auth', 'verified']);
Route::resource('/article_ad_templates', ArticleAdTemplateController::class)->middleware(['auth', 'verified']);
Route::post('/article_ad_templates/update/{id}', [ArticleAdTemplateController::class, 'update_ad'])->middleware(['auth', 'verified']);
Route::resource('/article_ads', ArticleAdController::class)->middleware(['auth', 'verified']);

// Route::get('articles/{id}', [ArticleController::class, 'show'])->name('articles.show')->middleware(['auth', 'verified']);
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
