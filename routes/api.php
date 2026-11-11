<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Content-Security-Policy の違反報告(ブラウザが自動で送る)。api グループの回数制限(1分に60回)がかかる
Route::post('/csp-report', [\App\Http\Controllers\CspReportController::class, 'store'])->name('csp.report');
