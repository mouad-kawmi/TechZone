<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StoreSetting;
use Illuminate\Http\Request;

class StoreSettingController extends Controller
{
    public function show()
    {
        return $this->settings()->toFrontendArray();
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'storeName' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'deliveryFee' => ['nullable', 'numeric', 'min:0'],
            'freeDeliveryThreshold' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'maintenanceMode' => ['nullable', 'boolean'],
            'notifyOrders' => ['nullable', 'boolean'],
            'notifyMessages' => ['nullable', 'boolean'],
        ]);

        $settings = $this->settings();
        $settings->update([
            'store_name' => $data['storeName'] ?? $settings->store_name,
            'email' => $data['email'] ?? $settings->email,
            'phone' => $data['phone'] ?? $settings->phone,
            'address' => $data['address'] ?? $settings->address,
            'delivery_fee' => $data['deliveryFee'] ?? $settings->delivery_fee,
            'free_delivery_threshold' => $data['freeDeliveryThreshold'] ?? $settings->free_delivery_threshold,
            'currency' => $data['currency'] ?? $settings->currency,
            'maintenance_mode' => $data['maintenanceMode'] ?? $settings->maintenance_mode,
            'notify_orders' => $data['notifyOrders'] ?? $settings->notify_orders,
            'notify_messages' => $data['notifyMessages'] ?? $settings->notify_messages,
        ]);

        return $settings->fresh()->toFrontendArray();
    }

    private function settings(): StoreSetting
    {
        return StoreSetting::first() ?: StoreSetting::create([]);
    }
}
