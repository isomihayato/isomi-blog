<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\InfomationController;
use App\Http\Controllers\ArticleAdTemplateController;
use App\Http\Controllers\ArticleAdController;
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
Route::get('/infomations/list', [FrontController::class, 'infomation_list'])->name('fronts.infomation_list');
Route::get('/infomations/show_by_bar', [InfomationController::class, 'get_show_by_bar'])->name('infomations.showByBar');
Route::get('/articles/details/{id}', [FrontController::class, 'article'])->name('fronts.article');
Route::get('/member/login', [FrontController::class, 'login'])->name('fronts.login');
Route::post('/members', [MembersController::class, 'store'])->name('members.store');
Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
Route::post('/comments/update',[CommentController::class, 'update'])->name('comments.update');
Route::delete(('/comments/{comment}'), [CommentController::class, 'destroy'])->name('comments.destroy');
Route::post('/comments/get/comments', [CommentController::class, 'get_comments'])->name('comments.get_comments');
// Route::resource('/comments', CommentController::class);
// Route::resources('articles', 'ArticleController', ['except' => ['show']])->middleware(['auth', 'verified']);
Route::get('/articles/search', [FrontController::class, 'search'])->name('fronts.search');
Route::post('/articles/search', [ArticleController::class, 'search'])->name('articles.search');
Route::resource('articles', ArticleController::class)->middleware(['auth', 'verified']);
Route::post('/articles/update/{id}', [ArticleController::class, 'update_article'])->middleware(['auth', 'verified']);
Route::post('/articles/uploadImg', [ArticleController::class, 'uploadImg'])->middleware(['auth', 'verified']);
Route::resource('/article_ad_templates', ArticleAdTemplateController::class)->middleware(['auth', 'verified']);
Route::post('/article_ad_templates/update/{id}', [ArticleAdTemplateController::class, 'update_ad'])->middleware(['auth', 'verified']);
Route::resource('/article_ads', ArticleAdController::class)->middleware(['auth', 'verified']);
Route::resource('/infomations', InfomationController::class, ['except' => ['index','show']])->middleware(['auth', 'verified']);
Route::get('/infomations', [InfomationController::class, 'index'])->name('infomations.index');
Route::get('/infomations/{id}', [InfomationController::class, 'show'])->name('infomations.show');
Route::get('/debug-sentry', function () {
    throw new Exception('My first Sentry error!');
});


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
