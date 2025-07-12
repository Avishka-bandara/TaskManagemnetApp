<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function createTask(Request $request){
        $validate = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
        ]);

        return response()->json([
            'message' => 'Task created successfully',
            'task' => $task,
        ], 201);
    }

    public function updateTask(Request $request, $id){
        $task = Task::findOrFail($id);

        $validate = $request->validate([
            'status' => 'required|string|in:in_progress,completed',

        ]);
        $task->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task,
        ]);
    }


    public function deleteTask($id){
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ], 200);
    }
}
