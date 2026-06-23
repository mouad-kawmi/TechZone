<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Events\NotificationCreated;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::latest();

        if ($request->route('userId')) {
            $query->where(function ($builder) use ($request) {
                $builder->whereNull('user_id')->orWhere('user_id', $request->route('userId'));
            });
        }

        return $query->limit(50)->get()->map(fn (Notification $notification) => $notification->toFrontendArray());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'userId' => ['nullable', 'integer', 'exists:users,id'],
            'type' => ['nullable', 'string'],
            'title' => ['required', 'string'],
            'message' => ['nullable', 'string'],
            'link' => ['nullable', 'string'],
        ]);

        $notification = Notification::create([
            'user_id' => $data['userId'] ?? null,
            'type'    => $data['type'] ?? 'info',
            'title'   => $data['title'],
            'message' => $data['message'] ?? null,
            'link'    => $data['link'] ?? null,
        ]);

        // Broadcast real-time to admin panel via Reverb
        broadcast(new NotificationCreated($notification))->toOthers();

        return $notification->toFrontendArray();
    }

    public function markRead(Notification $notification)
    {
        $notification->update(['read' => true]);

        return $notification->fresh()->toFrontendArray();
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return response()->noContent();
    }
}
