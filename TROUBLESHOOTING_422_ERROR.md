# 🔧 TechZone 422 Error Troubleshooting Guide

## 📊 Error Overview
- **Status Code**: 422 Unprocessable Content
- **Meaning**: Server understood the request but rejected it due to validation failures
- **Affected Endpoints**:
  - `POST /api/auth/login` 
  - `POST /api/auth/register`
  - `POST /api/users/{id}/cart/merge`

---

## ✅ Step-by-Step Troubleshooting

### Step 1: Check Laravel Logs
After reproducing the error, check the error logs:

```bash
cd "Backend Laravel TechZone"
Get-Content storage/logs/laravel.log -Tail 30
```

**Look for these entries**:
- `[ERROR] Login validation failed`
- `[ERROR] Register validation failed`  
- `[ERROR] Cart merge validation failed`

---

### Step 2: Validate Database Connection

Run in the project directory:

```bash
php artisan tinker
# Type: DB::connection()->getPdo()
# Expected: Should return PDOException or show connection successful
```

**If you get a PDO error**, your database connection failed. Fix:

```bash
# Verify database is running (MySQL/MariaDB)
# Update .env file:
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dbLaravelTech
DB_USERNAME=root
DB_PASSWORD=  # Leave empty if no password
```

---

### Step 3: Run Database Migrations

Ensure all tables are created:

```bash
php artisan migrate
```

**Expected output**: Tables created or "No pending migrations"

---

### Step 4: Seed Test Data

Create a test user to login with:

```bash
php artisan tinker
# In tinker shell:
$user = User::create([
  'name' => 'Test User',
  'full_name' => 'Test User',
  'username' => 'testuser',
  'email' => 'test@example.com',
  'password' => bcrypt('password123'),
  'role' => 'user'
]);
exit
```

---

### Step 5: Test Login Endpoint

Use Postman or cURL to test:

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**If you get 422**, the response will include validation errors.

---

### Step 6: Frontend Request Inspection

In browser DevTools (F12), go to **Network** tab:

1. **Attempt login**
2. **Find the login request**
3. **Click on it → Request tab → Payload section**
4. **Check the payload looks like**:
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

---

## 🚨 Common Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Empty Email/Password** | 422 with `email required` or `password required` | Check form inputs are not empty before submitting |
| **Invalid Email Format** | 422 with `email invalid` (on register) | Ensure email looks like: `user@example.com` |
| **Duplicate Email** | 422 with `email already exists` (on register) | Use a different email address |
| **User Not Found** | Login fails but no 422 error | Create the user first with registration endpoint |
| **Missing Products** | 422 on cart merge with `productId exists` | Seed the database with products |
| **Database Connection Failed** | All endpoints return 500/422 | Check MySQL is running and `.env` is correct |
| **Sessions Table Missing** | 500 error in logs about sessions | Run: `php artisan migrate` |

---

## 📝 Validation Rules Reference

### Login
```php
'email' => ['required', 'string']
'password' => ['required', 'string']
```

### Register
```php
'fullName' => ['required', 'string', 'max:255']
'email' => ['required', 'email', 'unique:users,email']
'password' => ['required', 'string', 'min:6']
'phone' => ['nullable', 'string', 'max:40']
```

### Cart Merge
```php
'items' => ['nullable', 'array']
'items.*.productId' => ['required', 'integer', 'exists:products,id']
'items.*.quantity' => ['nullable', 'integer', 'min:1']
'items.*.variant' => ['nullable', 'string', 'max:100']
```

---

## 🔍 Advanced Debugging

### Enable Debug Mode
1. Edit `.env`:
   ```
   APP_DEBUG=true
   ```

2. Restart Laravel server

3. Now 422 errors will show detailed validation messages

### Check Logs in Real-Time
```bash
# In PowerShell, in another terminal:
Get-Content storage/logs/laravel.log -Wait
```

This shows new log entries as they happen.

---

## 📞 Need More Help?

1. **Check if MySQL is running**: Open Task Manager → look for MySQL service
2. **Verify `.env` database credentials**: They must match your MySQL setup
3. **Clear Laravel cache**: 
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```

---

## ✨ Successful Response Examples

### Successful Login (200 OK)
```json
{
  "token": "local-token-1",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### Successful Register (200 OK)
Same as login response

### Successful Cart Merge (200 OK)
```json
{
  "id": 1,
  "items": [ /* ... */ ]
}
```
