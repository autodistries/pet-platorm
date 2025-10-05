-- Seed data for Online Pet Accessories Platform

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

-- Insert sample customer
INSERT INTO customers (id, name, email, password_hash, phone) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Marie Dubois', 'marie.dubois@email.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqO', '+33123456789');

-- Insert sample address
INSERT INTO customer_addresses (customer_id, type, street_address, city, postal_code, country, is_default) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'shipping', '123 Rue de la Paix', 'Paris', '75001', 'France', TRUE),
    ('770e8400-e29b-41d4-a716-446655440001', 'billing', '123 Rue de la Paix', 'Paris', '75001', 'France', TRUE);
