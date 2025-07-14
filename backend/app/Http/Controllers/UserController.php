<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\User;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

    if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();

    return response()->json([
        'message' => 'Login successful',
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role, 
        ]
    ], 200);
    }


    public function register (Request $request)
    {
       $validated = $request->validate([
        'name'=> 'required|string|max:255',
        'email'=> 'required|email|unique:users,email',
        'password'=> 'required|string|min:6',
    ]);

    $user = User::create([
        'name'=> $validated['name'],
        'email'=> $validated['email'],
        'password'=> Hash::make($validated['password']),
        'role' => 'user', 
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
    ], 201);
    }



    public function fetchUser(){

        $users = User::where('role', 'user')->get(); 
        return response()->json($users);
    }

    public function fetchAuth()
    {
    return response()->json(Auth::user());
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->all());

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    public function UpdateUserProfile(Request $request)
    {
        $user = Auth::user();
        $user->update($request->all());

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user], 200);
    }


    public function deleteUser($id){
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ], 200);
    }
}
