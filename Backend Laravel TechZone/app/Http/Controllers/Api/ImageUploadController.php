<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'file' => ['required', 'image', 'max:10240'],
            'folder' => ['nullable', 'string'],
        ]);

        $folder = trim(str_replace(['..', '\\'], '', $data['folder'] ?? 'techzone/products'), '/');
        $directory = public_path($folder);
        File::ensureDirectoryExists($directory);

        $file = $request->file('file');
        $filename = Str::uuid().'.'.$file->getClientOriginalExtension();
        $file->move($directory, $filename);

        $path = $folder.'/'.$filename;
        $url = asset($path);

        return [
            'secureUrl' => $url,
            'imageUrl' => $url,
            'publicId' => $path,
        ];
    }
}
