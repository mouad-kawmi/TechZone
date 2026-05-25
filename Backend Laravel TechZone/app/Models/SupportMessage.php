<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupportMessage extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'subject',
        'message',
        'status',
        'reply',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'fullName' => $this->full_name,
            'name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'reply' => $this->reply,
            'read' => $this->status !== 'NEW',
            'createdAt' => optional($this->created_at)->toISOString(),
        ];
    }
}
