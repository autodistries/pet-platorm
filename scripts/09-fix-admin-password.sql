-- Correction du mot de passe admin pour Admin123!
-- Hash généré avec bcrypt salt rounds = 10

UPDATE customers
SET password_hash = '$2b$10$nC3Z8vQ3qXH4sOiH/pGWKOZN5YVmxWrJKMF8vJXZYHQpX7sN8FGHy'
WHERE email = 'admin@petshop.com' AND role = 'admin';

-- Vérification
SELECT id, name, email, role, 
       substring(password_hash, 1, 20) || '...' as password_hash_preview
FROM customers 
WHERE role = 'admin';
