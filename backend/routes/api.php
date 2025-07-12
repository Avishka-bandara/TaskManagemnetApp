<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login',[UserController::class, 'login']);
Route::post('/register',[UserController::class, 'register']);

// only user 
Route::middleware(['auth:api', 'role:user'])->group(function () {
    Route::post('/update-user/{id}', [UserController::class, 'updateUser']);
    
});


// only admin and user
Route::middleware(['auth:api', 'role:admin,user'])->group(function () {
    // Route::get('/user/tasks', [TaskController::class, 'fetchTasks']);
    Route::post('/task/{id}', [TaskController::class, 'updateTask']);
    Route::get('/fetch-user', [UserController::class, 'fetchAuth']);
});

// only admin
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    Route::post('/task', [TaskController::class, 'createTask']);
    Route::delete('/task/{id}', [TaskController::class, 'deleteTask']);
    Route::get('/users', [UserController::class, 'fetchUser']);
});