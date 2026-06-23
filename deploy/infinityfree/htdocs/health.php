<?php

$appRoot = __DIR__.'/techzone-app';

$checks = [
    'php_version' => [
        'ok' => version_compare(PHP_VERSION, '8.2.0', '>='),
        'value' => PHP_VERSION,
        'expected' => '8.2.0 or newer',
    ],
    'app_folder' => [
        'ok' => is_dir($appRoot),
        'value' => $appRoot,
        'expected' => 'Folder exists',
    ],
    'vendor_autoload' => [
        'ok' => is_file($appRoot.'/vendor/autoload.php'),
        'value' => $appRoot.'/vendor/autoload.php',
        'expected' => 'File exists',
    ],
    'bootstrap_app' => [
        'ok' => is_file($appRoot.'/bootstrap/app.php'),
        'value' => $appRoot.'/bootstrap/app.php',
        'expected' => 'File exists',
    ],
    'env_file' => [
        'ok' => is_file($appRoot.'/.env'),
        'value' => $appRoot.'/.env',
        'expected' => 'File exists',
    ],
    'storage_writable' => [
        'ok' => is_writable($appRoot.'/storage'),
        'value' => $appRoot.'/storage',
        'expected' => 'Writable folder',
    ],
    'bootstrap_cache_writable' => [
        'ok' => is_writable($appRoot.'/bootstrap/cache'),
        'value' => $appRoot.'/bootstrap/cache',
        'expected' => 'Writable folder',
    ],
    'pdo_mysql_extension' => [
        'ok' => extension_loaded('pdo_mysql'),
        'value' => extension_loaded('pdo_mysql') ? 'loaded' : 'missing',
        'expected' => 'loaded',
    ],
    'openssl_extension' => [
        'ok' => extension_loaded('openssl'),
        'value' => extension_loaded('openssl') ? 'loaded' : 'missing',
        'expected' => 'loaded',
    ],
    'mbstring_extension' => [
        'ok' => extension_loaded('mbstring'),
        'value' => extension_loaded('mbstring') ? 'loaded' : 'missing',
        'expected' => 'loaded',
    ],
];

header('Content-Type: text/html; charset=utf-8');
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>TechZone Health Check</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 32px; color: #111827; background: #f9fafb; }
        table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e5e7eb; }
        th, td { padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
        th { background: #f3f4f6; }
        .ok { color: #047857; font-weight: 700; }
        .bad { color: #b91c1c; font-weight: 700; }
        code { background: #f3f4f6; padding: 2px 5px; border-radius: 4px; }
    </style>
</head>
<body>
    <h1>TechZone Health Check</h1>
    <table>
        <thead>
            <tr>
                <th>Check</th>
                <th>Status</th>
                <th>Value</th>
                <th>Expected</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($checks as $name => $check): ?>
                <tr>
                    <td><code><?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?></code></td>
                    <td class="<?= $check['ok'] ? 'ok' : 'bad' ?>"><?= $check['ok'] ? 'OK' : 'FAILED' ?></td>
                    <td><?= htmlspecialchars((string) $check['value'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td><?= htmlspecialchars((string) $check['expected'], ENT_QUOTES, 'UTF-8') ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</body>
</html>
