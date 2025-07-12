<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;


class Task extends Model
{
    use HasFactory;

    protected $table = 'task';
    protected $fillable = [
        'title',
        'description',
        'status',
        'due_date',
    ];

    public function user(){
        return $this->belongsToMany(User::class, 'user_task', 'task_id', 'user_id');
    }
}
