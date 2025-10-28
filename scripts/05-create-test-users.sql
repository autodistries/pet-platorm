-- Vérifier les utilisateurs existants
SELECT id, email, name FROM customers;

-- Supprimer les utilisateurs de test s'ils existent déjà (pour éviter les doublons)
DELETE FROM customers WHERE email IN ('marie@example.com', 'pierre@example.com', 'client@test.com');

-- Créer un utilisateur client de test : Marie Dubois
-- Email: marie@example.com
-- Mot de passe: password123
-- Hash bcrypt pour "password123"
INSERT INTO customers (id, name, email, password_hash, phone, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440099',
  'Marie Dubois',
  'marie@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0612345678',
  CURRENT_TIMESTAMP
);

-- Créer un deuxième utilisateur client de test : Pierre Martin
-- Email: pierre@example.com
-- Mot de passe: password123
INSERT INTO customers (id, name, email, password_hash, phone, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440098',
  'Pierre Martin',
  'pierre@example.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0687654321',
  CURRENT_TIMESTAMP
);

-- Créer un troisième utilisateur simple : Client Test
-- Email: client@test.com
-- Mot de passe: test123
INSERT INTO customers (id, name, email, password_hash, phone, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440097',
  'Client Test',
  'client@test.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  '0600000000',
  CURRENT_TIMESTAMP
);

-- Afficher les utilisateurs créés
SELECT id, email, name, phone FROM customers ORDER BY created_at DESC;

