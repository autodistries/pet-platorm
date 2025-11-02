-- Fix admin password hash
-- Password: password123
-- Hash généré avec bcrypt rounds=10

UPDATE customers
SET password_hash = '$2b$10$YfPgXn3i04ZFjHRmhoN/geqVoxmaH7OasKrJKcvrLphX54r7BTi76'
WHERE email = 'admin@petshop.com';

-- Vérification
SELECT 
    email, 
    role,
    length(password_hash) as hash_length,
    substring(password_hash, 1, 7) as hash_prefix
FROM customers 
WHERE email = 'admin@petshop.com';
