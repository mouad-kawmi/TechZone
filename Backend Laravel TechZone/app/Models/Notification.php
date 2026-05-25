<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['user_id', 'type', 'title', 'message', 'link', 'read'];

    protected $casts = [
        'read' => 'boolean',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'userId' => $this->user_id,
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'link' => $this->link,
            'read' => $this->read,
            'createdAt' => optional($this->created_at)->toISOString(),
            'timestamp' => optional($this->created_at)->getTimestampMs(),
        ];
    }
}
