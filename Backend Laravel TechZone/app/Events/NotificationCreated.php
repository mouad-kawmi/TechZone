<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Notification $notification) {}

    /**
     * Broadcast on the global admin channel.
     * Admin panel subscribes to this channel via Echo.
     */
    public function broadcastOn(): Channel
    {
        return new Channel('admin.notifications');
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id'        => $this->notification->id,
            'type'      => $this->notification->type,
            'title'     => $this->notification->title,
            'message'   => $this->notification->message,
            'link'      => $this->notification->link,
            'read'      => false,
            'timestamp' => now()->toISOString(),
        ];
    }
}
