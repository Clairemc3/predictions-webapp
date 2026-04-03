<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionTitleCache extends Model
{
    protected $fillable = [
        'title',
        'short_title',
    ];
}
