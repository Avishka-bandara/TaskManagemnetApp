<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use Carbon\Carbon;

class TaskController extends Controller
{
    public function createTask(Request $request){

        // dd($request->all());
            $validate = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'due_date' => 'required|date',
                'assigned_user_id' => 'required|exists:users,id'
                
            ]);
            $task = Task::create([
                'title' => $validate['title'],
                'description' => $validate['description'],
                'due_date' => $validate['due_date'],
                'user_id' => $validate['assigned_user_id'],
                'start_date' => Carbon::today(), 
            ]);
            return response()->json([
                'message' => 'Task created successfully',
                'task' => $task,
            ], 201);
        

    }

    public function updateTask(Request $request, $id){
        
        if(Auth()->user()->role !== 'admin'){
            $task = Task::findOrFail($id);
            $validate = $request->validate([
                'status' => 'required|string|in:in_progress,completed',
                
    
            ]);
            $task->update([
                'status' => $request->status,
                'remarks' => $request->remarks,
                'time_spent' => $request->time_spent,
            ]);
            return response()->json([
                'message' => 'Task updated successfully',
                'task' => $task,
            ]);
        }else{
            $task = Task::findOrFail($id);
            $task->update([
                'title' => $request->title,
                'description' => $request->description,
                'due_date' => $request->due_date,
                'user_id' => $request->user_id,
            ]);
        }

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


    public function fetchTasks(){
        $tasks = Task::with('user')->get(); 
        return response()->json($tasks);
    }
}
