SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `support_messages`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `coupons`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `product_variants`;
DROP TABLE IF EXISTS `product_images`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `brands`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `cache_locks`;
DROP TABLE IF EXISTS `cache`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `password_reset_tokens`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `store_settings`;
DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `points` int unsigned NOT NULL DEFAULT 0,
  `avatar_url` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_name_unique` (`name`),
  UNIQUE KEY `brands_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `old_price` decimal(10,2) DEFAULT NULL,
  `stock` int unsigned NOT NULL DEFAULT 0,
  `sku` varchar(255) DEFAULT NULL,
  `category_id` bigint unsigned DEFAULT NULL,
  `brand_id` bigint unsigned DEFAULT NULL,
  `specs` longtext DEFAULT NULL,
  `technical_specs` longtext DEFAULT NULL,
  `is_new` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `reviews_count` int unsigned NOT NULL DEFAULT 0,
  `promo_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_index` (`category_id`),
  KEY `products_brand_id_index` (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` text NOT NULL,
  `public_id` varchar(255) DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 0,
  `sort_order` int unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_index` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_variants` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'STORAGE',
  `value` varchar(255) NOT NULL,
  `color_hex` varchar(255) DEFAULT NULL,
  `stock` int unsigned NOT NULL DEFAULT 0,
  `price_delta` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variants_product_id_index` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `user` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `rating` tinyint unsigned NOT NULL DEFAULT 5,
  `body` text DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_approved` tinyint(1) NOT NULL DEFAULT 1,
  `helpful_count` int unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_product_id_index` (`product_id`),
  KEY `reviews_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `carts_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT 1,
  `variant` varchar(255) DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_items_cart_id_index` (`cart_id`),
  KEY `cart_items_product_id_index` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `coupons` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'PERCENT',
  `value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `minimum_order` decimal(10,2) NOT NULL DEFAULT 0.00,
  `usage_limit` int unsigned DEFAULT NULL,
  `used_count` int unsigned NOT NULL DEFAULT 0,
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `shipping_name` varchar(255) NOT NULL,
  `shipping_phone` varchar(255) DEFAULT NULL,
  `shipping_email` varchar(255) DEFAULT NULL,
  `shipping_street` varchar(255) DEFAULT NULL,
  `shipping_city` varchar(255) DEFAULT NULL,
  `shipping_postal` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'EN_ATTENTE',
  `payment_method` varchar(255) NOT NULL DEFAULT 'COD',
  `payment_status` varchar(255) NOT NULL DEFAULT 'PENDING',
  `subtotal` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping_cost` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_code` varchar(255) DEFAULT NULL,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`order_number`),
  KEY `orders_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned DEFAULT NULL,
  `product_title` varchar(255) NOT NULL,
  `product_image` text DEFAULT NULL,
  `unit_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantity` int unsigned NOT NULL DEFAULT 1,
  `variant` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_index` (`order_id`),
  KEY `order_items_product_id_index` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `support_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'NEW',
  `reply` text DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `support_messages_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `store_settings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `store_name` varchar(255) NOT NULL DEFAULT 'TechZone Electro',
  `email` varchar(255) NOT NULL DEFAULT 'contact@techzone.ma',
  `phone` varchar(255) NOT NULL DEFAULT '+212 600-000000',
  `address` varchar(255) NOT NULL DEFAULT 'Casablanca, Morocco',
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 30.00,
  `free_delivery_threshold` decimal(10,2) NOT NULL DEFAULT 2000.00,
  `currency` varchar(255) NOT NULL DEFAULT 'MAD',
  `maintenance_mode` tinyint(1) NOT NULL DEFAULT 0,
  `notify_orders` tinyint(1) NOT NULL DEFAULT 1,
  `notify_messages` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_17_000100_create_techzone_tables', 1);

INSERT INTO `users` (`id`, `name`, `full_name`, `username`, `email`, `phone`, `address`, `role`, `points`, `avatar_url`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin TechZone', 'Admin TechZone', 'admin', 'admin@techzone.ma', '+212 600-000000', NULL, 'admin', 0, NULL, NULL, '$2y$10$IG6.Wrg0NCyFj8X4SuXnNe0paH4VfueiGw/NHx9LtNMuiDr6ll/1K', NULL, NOW(), NOW()),
(2, 'Client Demo', 'Client Demo', 'client', 'client@techzone.ma', '+212 611-111111', NULL, 'user', 200, NULL, NULL, '$2y$10$.TQKjbF4l6mZpPXVTbDbjedtwSDCqJg2SmQJFPA7i9Tzi5VKadHUC', NULL, NOW(), NOW());

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `icon`, `image_url`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Smartphones', 'smartphones', NULL, NULL, NULL, 1, 0, NOW(), NOW()),
(2, 'Laptops', 'laptops', NULL, NULL, NULL, 1, 1, NOW(), NOW()),
(3, 'Tablets', 'tablets', NULL, NULL, NULL, 1, 2, NOW(), NOW()),
(4, 'Audio', 'audio', NULL, NULL, NULL, 1, 3, NOW(), NOW());

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Apple', 'apple', NULL, 1, NOW(), NOW()),
(2, 'Samsung', 'samsung', NULL, 1, NOW(), NOW()),
(3, 'HP', 'hp', NULL, 1, NOW(), NOW()),
(4, 'Sony', 'sony', NULL, 1, NOW(), NOW()),
(5, 'Bose', 'bose', NULL, 1, NOW(), NOW());

INSERT INTO `store_settings` (`id`, `store_name`, `email`, `phone`, `address`, `delivery_fee`, `free_delivery_threshold`, `currency`, `maintenance_mode`, `notify_orders`, `notify_messages`, `created_at`, `updated_at`) VALUES
(1, 'TechZone Electro', 'contact@techzone.ma', '+212 600-000000', 'Casablanca, Morocco', 30.00, 2000.00, 'MAD', 0, 1, 1, NOW(), NOW());

INSERT INTO `coupons` (`id`, `code`, `type`, `value`, `active`, `minimum_order`, `usage_limit`, `used_count`, `starts_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'PERCENT', 10.00, 1, 500.00, NULL, 0, NULL, NULL, NOW(), NOW());

INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `old_price`, `stock`, `sku`, `category_id`, `brand_id`, `specs`, `technical_specs`, `is_new`, `is_featured`, `is_active`, `rating`, `reviews_count`, `promo_expires_at`, `created_at`, `updated_at`) VALUES
(1, 'iPhone 15 Pro Max', 'iphone-15-pro-max', 'Smartphone premium avec puce A17 Pro et camera avancee.', 12900.00, 13900.00, 12, NULL, 1, 1, '{\"Ecran\":\"6.7 pouces\",\"Stockage\":\"256GB\",\"Puce\":\"A17 Pro\"}', NULL, 0, 1, 1, 5.00, 1, NULL, NOW(), NOW()),
(2, 'HP Spectre x360', 'hp-spectre-x360', 'Laptop convertible elegant pour travail et creation.', 15000.00, 17000.00, 7, NULL, 2, 3, '{\"CPU\":\"Intel Core i7\",\"RAM\":\"16GB\",\"SSD\":\"1TB\"}', NULL, 0, 1, 1, 5.00, 1, NULL, NOW(), NOW()),
(3, 'iPad Pro 12.9', 'ipad-pro-12-9', 'Tablette puissante pour design, notes et multimedia.', 11200.00, NULL, 9, NULL, 3, 1, '{\"Ecran\":\"12.9 pouces\",\"Puce\":\"M2\",\"Stockage\":\"256GB\"}', NULL, 0, 1, 1, 5.00, 1, NULL, NOW(), NOW()),
(4, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Casque bluetooth avec reduction de bruit active.', 3900.00, 4500.00, 16, NULL, 4, 4, '{\"Autonomie\":\"30h\",\"Bluetooth\":\"5.2\",\"ANC\":\"Oui\"}', NULL, 0, 1, 1, 5.00, 1, NULL, NOW(), NOW());

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `public_id`, `alt_text`, `is_primary`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop', NULL, 'iPhone 15 Pro Max', 1, 0, NOW(), NOW()),
(2, 2, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop', NULL, 'HP Spectre x360', 1, 0, NOW(), NOW()),
(3, 3, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?q=80&w=1200&auto=format&fit=crop', NULL, 'iPad Pro 12.9', 1, 0, NOW(), NOW()),
(4, 4, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop', NULL, 'Sony WH-1000XM5', 1, 0, NOW(), NOW());

INSERT INTO `product_variants` (`id`, `product_id`, `type`, `value`, `color_hex`, `stock`, `price_delta`, `created_at`, `updated_at`) VALUES
(1, 1, 'STORAGE', '256', NULL, 8, 0.00, NOW(), NOW()),
(2, 1, 'STORAGE', '512', NULL, 4, 0.00, NOW(), NOW()),
(3, 2, 'STORAGE', '16GB / 1TB', NULL, 7, 0.00, NOW(), NOW()),
(4, 3, 'STORAGE', 'WiFi', NULL, 5, 0.00, NOW(), NOW()),
(5, 3, 'STORAGE', 'Cellular', NULL, 4, 0.00, NOW(), NOW()),
(6, 4, 'STORAGE', 'Noir', NULL, 10, 0.00, NOW(), NOW()),
(7, 4, 'STORAGE', 'Argent', NULL, 6, 0.00, NOW(), NOW());

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `user`, `title`, `rating`, `body`, `is_verified`, `is_approved`, `helpful_count`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Client Demo', 'Avis verifie', 5, 'Produit conforme, livraison rapide et service client reactif.', 1, 1, 0, NOW(), NOW()),
(2, 2, NULL, 'Client Demo', 'Avis verifie', 5, 'Produit conforme, livraison rapide et service client reactif.', 1, 1, 0, NOW(), NOW()),
(3, 3, NULL, 'Client Demo', 'Avis verifie', 5, 'Produit conforme, livraison rapide et service client reactif.', 1, 1, 0, NOW(), NOW()),
(4, 4, NULL, 'Client Demo', 'Avis verifie', 5, 'Produit conforme, livraison rapide et service client reactif.', 1, 1, 0, NOW(), NOW());

COMMIT;
