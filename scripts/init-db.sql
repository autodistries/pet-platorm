-- Create database schema for Online Pet Accessories Platform
-- This script will be automatically executed when the Docker container starts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES CREATION
-- ============================================

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer addresses table
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('billing', 'shipping')) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'France',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category_id UUID REFERENCES categories(id),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    sku VARCHAR(100) UNIQUE,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_address_id UUID REFERENCES customer_addresses(id),
    billing_address_id UUID REFERENCES customer_addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('credit_card', 'paypal', 'bank_transfer')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    tracking_number VARCHAR(255),
    carrier VARCHAR(100),
    status VARCHAR(50) DEFAULT 'preparing' CHECK (status IN ('preparing', 'shipped', 'in_transit', 'delivered')),
    shipped_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support tickets table
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    subject VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support ticket messages table
CREATE TABLE support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type VARCHAR(20) CHECK (sender_type IN ('customer', 'support')) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_role ON customers(role);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_shipments_order ON shipments(order_id);
CREATE INDEX idx_support_tickets_customer ON support_tickets(customer_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert Admin User
-- Email: admin@petshop.com
-- Password: Admin123!
-- Hash généré avec bcrypt (10 rounds)
INSERT INTO customers (id, name, email, password_hash, phone, role) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', 'Administrateur', 'admin@petshop.com', '$2b$10$RZMrpooXsoYVrWcNaS.gx.r2gPxepBS8x8EPjmHH8H/Mz.ASJ.UJi', '+33100000000', 'admin');

-- Insert Sample Customer
-- Email: marie.dubois@email.com
-- Password: Marie123!
-- Hash généré avec bcrypt (10 rounds)
INSERT INTO customers (id, name, email, password_hash, phone, role) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Marie Dubois', 'marie.dubois@email.com', '$2b$10$bQgI/TpI7NtX.aZltgZPru138s.UnxvNWQy7LlC7sVSAsBz6MmpHa', '+33123456789', 'customer');

-- Insert categories
INSERT INTO categories (id, name, description) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Colliers et Laisses', 'Colliers, laisses et harnais pour chiens et chats'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Jouets', 'Jouets interactifs et d''exercice pour animaux'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Alimentation', 'Gamelles, distributeurs et accessoires d''alimentation'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Couchage', 'Paniers, coussins et accessoires de repos'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Hygiène', 'Produits et accessoires d''hygiène et de toilettage');

-- Insert sample products
INSERT INTO products (id, name, description, price, category_id, stock_quantity, sku, image_url) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Collier en Cuir Premium', 'Collier en cuir véritable avec boucle en métal, disponible en plusieurs tailles', 29.99, '550e8400-e29b-41d4-a716-446655440001', 50, 'COL-CUIR-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440002', 'Laisse Rétractable 5m', 'Laisse rétractable robuste avec système de freinage automatique', 24.99, '550e8400-e29b-41d4-a716-446655440001', 30, 'LAI-RET-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440003', 'Balle Interactive LED', 'Balle lumineuse interactive qui s''active au mouvement', 19.99, '550e8400-e29b-41d4-a716-446655440002', 75, 'JOU-BAL-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440004', 'Corde à Noeuds', 'Corde de jeu résistante avec noeuds, parfaite pour le tir à la corde', 12.99, '550e8400-e29b-41d4-a716-446655440002', 100, 'JOU-COR-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440005', 'Gamelle Anti-Glouton', 'Gamelle avec obstacles pour ralentir l''alimentation', 16.99, '550e8400-e29b-41d4-a716-446655440003', 40, 'GAM-ANT-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440006', 'Distributeur d''Eau Automatique', 'Fontaine à eau avec filtre pour chiens et chats', 45.99, '550e8400-e29b-41d4-a716-446655440003', 25, 'DIS-EAU-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440007', 'Panier Orthopédique', 'Panier avec mousse à mémoire de forme pour le confort articulaire', 89.99, '550e8400-e29b-41d4-a716-446655440004', 20, 'PAN-ORT-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440008', 'Coussin Chauffant', 'Coussin chauffant électrique avec thermostat réglable', 34.99, '550e8400-e29b-41d4-a716-446655440004', 35, 'COU-CHA-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440009', 'Brosse Auto-Nettoyante', 'Brosse de toilettage avec système de nettoyage automatique', 22.99, '550e8400-e29b-41d4-a716-446655440005', 60, 'BRO-AUT-001', '/placeholder.svg?height=300&width=300'),
    ('660e8400-e29b-41d4-a716-446655440010', 'Shampoing Naturel', 'Shampoing hypoallergénique aux extraits naturels', 13.99, '550e8400-e29b-41d4-a716-446655440005', 80, 'SHA-NAT-001', '/placeholder.svg?height=300&width=300');

-- Insert sample address for Marie
INSERT INTO customer_addresses (customer_id, type, street_address, city, postal_code, country, is_default) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'shipping', '123 Rue de la Paix', 'Paris', '75001', 'France', TRUE),
    ('770e8400-e29b-41d4-a716-446655440001', 'billing', '123 Rue de la Paix', 'Paris', '75001', 'France', TRUE);
