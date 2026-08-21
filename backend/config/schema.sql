-- ============================================
-- ShoeMart Database Schema for Supabase (PostgreSQL)
-- Run this entire file in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    category VARCHAR(50) NOT NULL,       -- e.g. Running, Casual, Formal, Sports, Sneakers, Basketball, Training, Slides
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),       -- set higher than price to show a discount badge
    stock INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    hover_image_url TEXT,                -- shown on card hover + as 2nd gallery image
    sizes VARCHAR(100) DEFAULT '6,7,8,9,10,11',
    rating NUMERIC(2, 1) DEFAULT 4.0,
    review_count INTEGER DEFAULT 0,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    size VARCHAR(10) DEFAULT '9',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, product_id, size)
);

-- WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

-- ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'COD',
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    shipping_name VARCHAR(150),
    shipping_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100),
    shipping_pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ORDER ITEMS TABLE (snapshot of product at time of order)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(150) NOT NULL,
    product_image TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    size VARCHAR(10)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin (to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);
