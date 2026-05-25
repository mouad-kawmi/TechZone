<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\SupportMessage;
use Illuminate\Http\Request;

class SupportMessageController extends Controller
{
    public function index()
    {
        return SupportMessage::latest()
            ->get()
            ->map(fn (SupportMessage $message) => $message->toFrontendArray());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'userId' => ['nullable', 'integer', 'exists:users,id'],
            'fullName' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        $message = SupportMessage::create([
            'user_id' => $data['userId'] ?? null,
            'full_name' => $data['fullName'],
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? 'Contact',
            'message' => $data['message'],
        ]);

        Notification::create([
            'type' => 'support',
            'title' => 'New support message',
            'message' => "{$message->full_name} sent: {$message->subject}",
            'link' => '/admin/messages',
        ]);

        return $message->toFrontendArray();
    }

    public function updateStatus(Request $request, SupportMessage $message)
    {
        $data = $request->validate([
            'status' => ['required', 'string'],
        ]);

        $message->update([
            'status' => $data['status'],
            'read_at' => now(),
        ]);

        return $message->fresh()->toFrontendArray();
    }

    public function reply(Request $request, SupportMessage $message)
    {
        $data = $request->validate([
            'reply' => ['required', 'string'],
        ]);

        $message->update([
            'reply' => $data['reply'],
            'status' => 'REPLIED',
            'read_at' => now(),
        ]);

        return $message->fresh()->toFrontendArray();
    }

    public function destroy(SupportMessage $message)
    {
        $message->delete();

        return response()->noContent();
    }
}
