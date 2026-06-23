# InfinityFree Deployment

Use this layout in InfinityFree File Manager:

```text
/htdocs/
+-- index.php
+-- .htaccess
+-- techzone/products/...
+-- techzone-app/
    +-- .htaccess
    +-- app/
    +-- bootstrap/
    +-- config/
    +-- database/
    +-- routes/
    +-- storage/
    +-- vendor/
    +-- .env
    +-- ...
```

1. Create `/htdocs/techzone-app`.
2. Upload everything from `Backend Laravel TechZone` except `public`, `node_modules`, `.git`, `.env`, logs, and cache files into `/htdocs/techzone-app`.
3. Upload `deploy/infinityfree/techzone-app/.htaccess` into `/htdocs/techzone-app`.
2. Upload `deploy/infinityfree/htdocs/index.php` and `.htaccess` into `/htdocs`.
3. Upload files from `Backend Laravel TechZone/public/techzone` into `/htdocs/techzone`.
4. Create `/techzone-app/.env` using `deploy/infinityfree/env.infinityfree.example`.
5. In phpMyAdmin, import `Backend Laravel TechZone/database/infinityfree_techzone.sql`.
