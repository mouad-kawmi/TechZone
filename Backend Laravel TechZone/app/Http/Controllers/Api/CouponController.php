<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request)
    {
        $data = $request->validate([
            'code' => ['required', 'string'],
            'subtotal' => ['required', 'numeric', 'min:0'],
        ]);

        $coupon = Coupon::where('code', strtoupper($data['code']))->first();

        if (! $coupon || ! $coupon->active) {
            return ['valid' => false, 'message' => 'Coupon invalide.'];
        }

        if ($coupon->starts_at && Carbon::now()->lt($coupon->starts_at)) {
            return ['valid' => false, 'message' => 'Coupon pas encore actif.'];
        }

        if ($coupon->expires_at && Carbon::now()->gt($coupon->expires_at)) {
            return ['valid' => false, 'message' => 'Coupon expire.'];
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return ['valid' => false, 'message' => 'Limite du coupon atteinte.'];
        }

        if ((float) $data['subtotal'] < (float) $coupon->minimum_order) {
            return ['valid' => false, 'message' => 'Minimum commande non atteint.'];
        }

        $discount = $this->discountAmount($coupon, (float) $data['subtotal']);

        return [
            'valid' => true,
            'message' => 'Coupon applique.',
            'discountType' => $coupon->type,
            'discountValue' => (float) $coupon->value,
            'discountAmount' => $discount,
        ];
    }

    public function discountAmount(Coupon $coupon, float $subtotal): float
    {
        if ($coupon->type === 'PERCENT') {
            return round($subtotal * ((float) $coupon->value / 100), 2);
        }

        return min($subtotal, (float) $coupon->value);
    }
}
