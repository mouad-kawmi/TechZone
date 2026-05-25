<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    protected $fillable = [
        'store_name',
        'email',
        'phone',
        'address',
        'delivery_fee',
        'free_delivery_threshold',
        'currency',
        'maintenance_mode',
        'notify_orders',
        'notify_messages',
    ];

    protected $casts = [
        'delivery_fee' => 'decimal:2',
        'free_delivery_threshold' => 'decimal:2',
        'maintenance_mode' => 'boolean',
        'notify_orders' => 'boolean',
        'notify_messages' => 'boolean',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'storeName' => $this->store_name,
            'name' => $this->store_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'deliveryFee' => (float) $this->delivery_fee,
            'freeDeliveryThreshold' => (float) $this->free_delivery_threshold,
            'currency' => $this->currency,
            'maintenanceMode' => $this->maintenance_mode,
            'notifyOrders' => $this->notify_orders,
            'notifyMessages' => $this->notify_messages,
        ];
    }
}
