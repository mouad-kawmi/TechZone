# TechZone Elite — Backend Spring Boot · Guide Complet

---

## 1. DÉPENDANCES MAVEN (`pom.xml`)

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.5</version>
</parent>

<properties>
    <java.version>21</java.version>
</properties>

<dependencies>

    <!-- ───── WEB ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- ───── DATABASE ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- ───── SECURITY + JWT ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.12.5</version>
        <scope>runtime</scope>
    </dependency>

    <!-- ───── VALIDATION ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- ───── IMAGE UPLOAD (Cloudinary) ───── -->
    <dependency>
        <groupId>com.cloudinary</groupId>
        <artifactId>cloudinary-http44</artifactId>
        <version>1.36.0</version>
    </dependency>

    <!-- ───── LOMBOK ───── -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- ───── MAPPER ───── -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct-processor</artifactId>
        <version>1.5.5.Final</version>
        <scope>provided</scope>
    </dependency>

    <!-- ───── MAIL ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

    <!-- ───── CACHE ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>

    <!-- ───── TESTS ───── -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>

</dependencies>
```

---

## 2. STRUCTURE DU PROJET (Enterprise)

```
techzone-backend/
│
├── src/main/java/com/techzone/
│   │
│   ├── TechZoneApplication.java               ← Main class
│   │
│   ├── config/
│   │   ├── SecurityConfig.java                ← JWT Security config
│   │   ├── CloudinaryConfig.java              ← Image upload config
│   │   ├── CorsConfig.java                    ← CORS pour React
│   │   ├── CacheConfig.java                   ← Cache config
│   │   └── OpenApiConfig.java                 ← Swagger UI
│   │
│   ├── security/
│   │   ├── jwt/
│   │   │   ├── JwtTokenProvider.java          ← Génère/valide JWT
│   │   │   ├── JwtAuthenticationFilter.java   ← Filter HTTP
│   │   │   └── JwtAuthEntryPoint.java         ← 401 handler
│   │   └── UserDetailsServiceImpl.java        ← Charge user from DB
│   │
│   ├── domain/                                ← Entités JPA
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── Category.java
│   │   ├── Product.java
│   │   ├── ProductImage.java
│   │   ├── ProductVariant.java
│   │   ├── Order.java
│   │   ├── OrderItem.java
│   │   ├── Cart.java
│   │   ├── CartItem.java
│   │   ├── Wishlist.java
│   │   ├── Review.java
│   │   ├── Address.java
│   │   └── Notification.java
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ProductRepository.java
│   │   ├── CategoryRepository.java
│   │   ├── OrderRepository.java
│   │   ├── CartRepository.java
│   │   ├── WishlistRepository.java
│   │   └── ReviewRepository.java
│   │
│   ├── service/
│   │   ├── auth/
│   │   │   ├── AuthService.java               ← Interface
│   │   │   └── AuthServiceImpl.java
│   │   ├── product/
│   │   │   ├── ProductService.java
│   │   │   └── ProductServiceImpl.java
│   │   ├── order/
│   │   │   ├── OrderService.java
│   │   │   └── OrderServiceImpl.java
│   │   ├── cart/
│   │   │   ├── CartService.java
│   │   │   └── CartServiceImpl.java
│   │   ├── wishlist/
│   │   │   ├── WishlistService.java
│   │   │   └── WishlistServiceImpl.java
│   │   ├── review/
│   │   │   ├── ReviewService.java
│   │   │   └── ReviewServiceImpl.java
│   │   ├── image/
│   │   │   ├── ImageService.java
│   │   │   └── CloudinaryImageService.java
│   │   └── mail/
│   │       └── MailService.java
│   │
│   ├── controller/
│   │   ├── AuthController.java                ← /api/auth/**
│   │   ├── ProductController.java             ← /api/products/**
│   │   ├── CategoryController.java            ← /api/categories/**
│   │   ├── OrderController.java               ← /api/orders/**
│   │   ├── CartController.java                ← /api/cart/**
│   │   ├── WishlistController.java            ← /api/wishlist/**
│   │   ├── ReviewController.java              ← /api/reviews/**
│   │   ├── ImageController.java               ← /api/images/**
│   │   ├── UserController.java                ← /api/users/**
│   │   └── AdminController.java               ← /api/admin/**
│   │
│   ├── dto/
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── ProductRequest.java
│   │   │   ├── OrderRequest.java
│   │   │   └── ReviewRequest.java
│   │   └── response/
│   │       ├── AuthResponse.java
│   │       ├── ProductResponse.java
│   │       ├── OrderResponse.java
│   │       ├── PageResponse.java
│   │       └── ApiResponse.java
│   │
│   ├── mapper/
│   │   ├── ProductMapper.java                 ← MapStruct
│   │   ├── OrderMapper.java
│   │   └── UserMapper.java
│   │
│   └── exception/
│       ├── GlobalExceptionHandler.java        ← @ControllerAdvice
│       ├── ResourceNotFoundException.java
│       ├── UnauthorizedException.java
│       └── ValidationException.java
│
├── src/main/resources/
│   ├── application.yml                        ← Config principale
│   ├── application-dev.yml
│   └── application-prod.yml
│
└── pom.xml
```

---

## 3. SCHÉMA SQL COMPLET

### `application.yml`
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/techzone_db?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate          # prod: validate | dev: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
        format_sql: true

app:
  jwt:
    secret: "techzone-elite-super-secret-key-2025-must-be-256bits"
    expiration: 86400000          # 24h en ms
    refresh-expiration: 604800000 # 7j

cloudinary:
  cloud-name: your_cloud_name
  api-key: your_api_key
  api-secret: your_api_secret
```

---

### SQL — Toutes les tables avec relations

```sql
-- ══════════════════════════════════════
-- DATABASE
-- ══════════════════════════════════════
CREATE DATABASE IF NOT EXISTS techzone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE techzone_db;

-- ══════════════════════════════════════
-- ROLES
-- ══════════════════════════════════════
CREATE TABLE roles (
    id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name    ENUM('ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR') NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN'), ('ROLE_MODERATOR');

-- ══════════════════════════════════════
-- USERS
-- ══════════════════════════════════════
CREATE TABLE users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,          -- BCrypt
    phone           VARCHAR(20),
    avatar_url      VARCHAR(500),
    is_active       BOOLEAN DEFAULT TRUE,
    email_verified  BOOLEAN DEFAULT FALSE,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ══════════════════════════════════════
-- USER ↔ ROLES (Many-to-Many)
-- ══════════════════════════════════════
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- ADDRESSES
-- ══════════════════════════════════════
CREATE TABLE addresses (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    label       VARCHAR(50),                        -- 'Maison', 'Bureau'
    full_name   VARCHAR(100) NOT NULL,
    phone       VARCHAR(20) NOT NULL,
    street      VARCHAR(255) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default  BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- CATEGORIES
-- ══════════════════════════════════════
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(100),
    image_url   VARCHAR(500),
    parent_id   BIGINT,                             -- Self-join: sous-catégories
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INT DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ══════════════════════════════════════
-- BRANDS
-- ══════════════════════════════════════
CREATE TABLE brands (
    id        BIGINT AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(100) NOT NULL UNIQUE,
    logo_url  VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE
);

-- ══════════════════════════════════════
-- PRODUCTS
-- ══════════════════════════════════════
CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(280) NOT NULL UNIQUE,
    description     TEXT,
    price           DECIMAL(10, 2) NOT NULL,
    old_price       DECIMAL(10, 2),
    stock           INT DEFAULT 0,
    sku             VARCHAR(100) UNIQUE,
    category_id     BIGINT,
    brand_id        BIGINT,
    is_new          BOOLEAN DEFAULT FALSE,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    is_out_of_stock BOOLEAN GENERATED ALWAYS AS (stock <= 0) STORED,
    promo_expires_at DATETIME,
    rating          DECIMAL(3, 2) DEFAULT 0.00,
    reviews_count   INT DEFAULT 0,
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_brand (brand_id),
    INDEX idx_price (price),
    INDEX idx_rating (rating)
);

-- ══════════════════════════════════════
-- PRODUCT IMAGES
-- ══════════════════════════════════════
CREATE TABLE product_images (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    image_url   VARCHAR(500) NOT NULL,
    public_id   VARCHAR(255),                       -- Cloudinary public_id
    alt_text    VARCHAR(200),
    is_primary  BOOLEAN DEFAULT FALSE,
    sort_order  INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- PRODUCT VARIANTS (Storage/Color)
-- ══════════════════════════════════════
CREATE TABLE product_variants (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    type        ENUM('STORAGE', 'COLOR', 'SIZE') NOT NULL,
    value       VARCHAR(100) NOT NULL,              -- '256GB', 'Noir Sidéral'
    stock       INT DEFAULT 0,
    price_delta DECIMAL(10, 2) DEFAULT 0.00,        -- Prix additionnel
    color_hex   VARCHAR(10),                        -- '#1C1C1E' pour COLOR
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_variant (product_id, type)
);

-- ══════════════════════════════════════
-- PRODUCT SPECS (Key-Value)
-- ══════════════════════════════════════
CREATE TABLE product_specs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    spec_key    VARCHAR(100) NOT NULL,              -- 'Processeur'
    spec_value  VARCHAR(500) NOT NULL,              -- 'Apple A17 Pro'
    sort_order  INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- ORDERS
-- ══════════════════════════════════════
CREATE TABLE orders (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number    VARCHAR(20) NOT NULL UNIQUE,    -- 'TZ-482931'
    user_id         BIGINT,                         -- NULL si guest
    status          ENUM('EN_ATTENTE','EN_COURS','EXPEDIE','LIVRE','ANNULE') DEFAULT 'EN_ATTENTE',
    payment_method  ENUM('COD','CARD','PAYPAL') NOT NULL,
    payment_status  ENUM('PENDING','PAID','FAILED','REFUNDED') DEFAULT 'PENDING',
    -- Montants
    subtotal        DECIMAL(10, 2) NOT NULL,
    shipping_cost   DECIMAL(10, 2) DEFAULT 0.00,
    discount        DECIMAL(10, 2) DEFAULT 0.00,
    final_total     DECIMAL(10, 2) NOT NULL,
    -- Adresse livraison (snapshot)
    shipping_name   VARCHAR(100) NOT NULL,
    shipping_phone  VARCHAR(20) NOT NULL,
    shipping_email  VARCHAR(150),
    shipping_street VARCHAR(255) NOT NULL,
    shipping_city   VARCHAR(100) NOT NULL,
    shipping_postal VARCHAR(20),
    -- Notes
    notes           TEXT,
    -- Timestamps
    created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    shipped_at      DATETIME,
    delivered_at    DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_orders (user_id),
    INDEX idx_order_status (status),
    INDEX idx_order_number (order_number)
);

-- ══════════════════════════════════════
-- ORDER ITEMS
-- ══════════════════════════════════════
CREATE TABLE order_items (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT,
    -- Snapshot produit au moment de la commande
    product_title   VARCHAR(255) NOT NULL,
    product_image   VARCHAR(500),
    unit_price      DECIMAL(10, 2) NOT NULL,
    quantity        INT NOT NULL,
    variant_info    VARCHAR(200),                   -- '256GB / Noir'
    line_total      DECIMAL(10, 2) GENERATED ALWAYS AS (unit_price * quantity) STORED,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ══════════════════════════════════════
-- CART
-- ══════════════════════════════════════
CREATE TABLE carts (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNIQUE NOT NULL,             -- 1 cart / user
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id     BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    quantity    INT NOT NULL DEFAULT 1,
    variant     VARCHAR(200),
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id, variant)
);

-- ══════════════════════════════════════
-- WISHLIST
-- ══════════════════════════════════════
CREATE TABLE wishlists (
    user_id     BIGINT NOT NULL,
    product_id  BIGINT NOT NULL,
    added_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- REVIEWS
-- ══════════════════════════════════════
CREATE TABLE reviews (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       VARCHAR(150),
    body        TEXT,
    is_verified BOOLEAN DEFAULT FALSE,              -- Achat vérifié
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY one_review_per_user (product_id, user_id),
    INDEX idx_product_reviews (product_id, is_approved)
);

-- ══════════════════════════════════════
-- NOTIFICATIONS
-- ══════════════════════════════════════
CREATE TABLE notifications (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT,                             -- NULL = admin global
    type        VARCHAR(50),                        -- 'ORDER_STATUS', 'STOCK_LOW'
    title       VARCHAR(150),
    message     TEXT,
    is_read     BOOLEAN DEFAULT FALSE,
    link        VARCHAR(255),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ══════════════════════════════════════
-- REFRESH TOKENS
-- ══════════════════════════════════════
CREATE TABLE refresh_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    token       VARCHAR(500) NOT NULL UNIQUE,
    expires_at  DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 4. ENTITÉS JPA PRINCIPALES

### `User.java`
```java
@Entity @Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Email @NotBlank @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "email_verified")
    private boolean emailVerified = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### `Product.java`
```java
@Entity @Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull @DecimalMin("0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "old_price", precision = 10, scale = 2)
    private BigDecimal oldPrice;

    @Min(0)
    private Integer stock = 0;

    private String sku;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @Column(name = "is_new")
    private boolean isNew = false;

    @Column(name = "is_featured")
    private boolean featured = false;

    @Column(name = "is_active")
    private boolean active = true;

    @Column(name = "promo_expires_at")
    private LocalDateTime promoExpiresAt;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "reviews_count")
    private Integer reviewsCount = 0;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductSpec> specs = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## 5. SÉCURITÉ — JWT

### `JwtTokenProvider.java`
```java
@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("userId", userDetails.getId())
                .claim("roles", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).toList())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser().verifyWith(getSignKey()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("JWT invalide: {}", e.getMessage());
            return false;
        }
    }

    private SecretKey getSignKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}
```

### `SecurityConfig.java`
```java
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(GET, "/api/products/**").permitAll()
                .requestMatchers(GET, "/api/categories/**").permitAll()
                .requestMatchers(GET, "/api/reviews/**").permitAll()
                // Authenticated
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/wishlist/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/profile/**").authenticated()
                // Admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
```

---

## 6. AUTHENTICATION — AuthController

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(authService.register(request));
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // POST /api/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken")));
    }

    // POST /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> body) {
        authService.logout(body.get("refreshToken"));
        return ResponseEntity.noContent().build();
    }
}
```

### `RegisterRequest.java`
```java
@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est requis")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String fullName;

    @NotBlank @Email(message = "Email invalide")
    private String email;

    @NotBlank
    @Size(min = 8, message = "Minimum 8 caractères")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$",
             message = "Le mot de passe doit contenir majuscule, minuscule et chiffre")
    private String password;

    private String phone;
}
```

---

## 7. IMAGE UPLOAD — Cloudinary

### `CloudinaryConfig.java`
```java
@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}") private String cloudName;
    @Value("${cloudinary.api-key}")    private String apiKey;
    @Value("${cloudinary.api-secret}") private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key",    apiKey,
            "api_secret", apiSecret,
            "secure",     true
        ));
    }
}
```

### `CloudinaryImageService.java`
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryImageService implements ImageService {

    private final Cloudinary cloudinary;

    @Override
    public String upload(MultipartFile file, String folder) {
        try {
            // Validation
            if (file.getSize() > 5 * 1024 * 1024)
                throw new ValidationException("Image trop grande (max 5MB)");
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/"))
                throw new ValidationException("Fichier invalide, uniquement les images sont acceptées");

            Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder",         "techzone/" + folder,
                    "transformation", "f_auto,q_auto,w_800",
                    "resource_type",  "image"
                )
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Erreur upload image: " + e.getMessage());
        }
    }

    @Override
    public void delete(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Erreur suppression image Cloudinary: {}", e.getMessage());
        }
    }
}
```

### `ImageController.java`
```java
@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    // POST /api/images/upload?folder=products
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {
        String url = imageService.upload(file, folder);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
```

---

## 8. GLOBAL EXCEPTION HANDLER

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
        return ResponseEntity.badRequest().body(Map.of(
            "status",  400,
            "error",   "Validation Failed",
            "details", errors
        ));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(Map.of(
            "status",  404,
            "error",   "Not Found",
            "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException ex) {
        return ResponseEntity.status(403).body(Map.of(
            "status",  403,
            "error",   "Forbidden",
            "message", "Accès refusé"
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        log.error("Erreur inattendue", ex);
        return ResponseEntity.status(500).body(Map.of(
            "status",  500,
            "error",   "Internal Server Error",
            "message", "Une erreur inattendue s'est produite"
        ));
    }
}
```

---

## 9. ENDPOINTS API COMPLETS

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Inscription |
| POST | `/api/auth/login` | ✗ | Connexion → JWT |
| POST | `/api/auth/refresh` | ✗ | Refresh token |
| GET | `/api/products` | ✗ | Liste paginée + filtres |
| GET | `/api/products/{slug}` | ✗ | Détail produit |
| GET | `/api/products/featured` | ✗ | Produits mis en avant |
| POST | `/api/products` | ADMIN | Créer produit |
| PUT | `/api/products/{id}` | ADMIN | Modifier produit |
| DELETE | `/api/products/{id}` | ADMIN | Supprimer produit |
| GET | `/api/categories` | ✗ | Toutes les catégories |
| GET | `/api/cart` | USER | Voir panier |
| POST | `/api/cart/items` | USER | Ajouter au panier |
| PUT | `/api/cart/items/{id}` | USER | Modifier quantité |
| DELETE | `/api/cart/items/{id}` | USER | Supprimer du panier |
| GET | `/api/wishlist` | USER | Voir wishlist |
| POST | `/api/wishlist/{productId}` | USER | Toggle wishlist |
| GET | `/api/orders` | USER | Mes commandes |
| POST | `/api/orders` | USER | Passer commande |
| GET | `/api/orders/{id}` | USER | Détail commande |
| GET | `/api/admin/orders` | ADMIN | Toutes les commandes |
| PATCH | `/api/admin/orders/{id}/status` | ADMIN | Changer statut |
| GET | `/api/reviews/product/{id}` | ✗ | Avis produit |
| POST | `/api/reviews` | USER | Laisser un avis |
| DELETE | `/api/reviews/{id}` | ADMIN | Supprimer avis |
| POST | `/api/images/upload` | ADMIN | Upload image |

> **Query params pour `/api/products`:**  
> `?page=0&size=12&sort=price,asc&category=Smartphones&brand=Apple&minPrice=500&maxPrice=5000&search=iphone`

---

## 10. CORS CONFIG (pour React localhost:5173)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "https://techzone.ma")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 11. DIAGRAMME DES RELATIONS

```
users ──────────────── user_roles ──── roles
  │
  ├── addresses
  ├── carts ─────────── cart_items ─── products
  ├── wishlists ─────────────────────── products
  ├── orders ─────────── order_items ── products
  ├── reviews ───────────────────────── products
  └── notifications

products ─── categories (ManyToOne)
         ─── brands     (ManyToOne)
         ─── product_images (OneToMany)
         ─── product_variants (OneToMany)
         ─── product_specs (OneToMany)
```

---

> [!TIP]
> **Ordre de création recommandé :**
> 1. Config (Security, CORS, Cloudinary)
> 2. Entités → Repositories → DTOs → Mappers
> 3. AuthService + JwtProvider
> 4. ProductService (le plus complexe)
> 5. OrderService (avec gestion stock)
> 6. Cart, Wishlist, Reviews
> 7. Admin endpoints
> 8. Tests

> [!IMPORTANT]
> Utilise `ddl-auto: update` en **dev** pour générer les tables automatiquement à partir des entités JPA. Passe à `validate` en **production** et gère les migrations avec **Flyway** ou **Liquibase**.
