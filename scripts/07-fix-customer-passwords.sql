-- Mettre à jour les mots de passe des utilisateurs de test
-- Nouveau hash bcrypt valide pour "password123"

UPDATE customers 
SET password_hash = '$2b$10$YfPgXn3i04ZFjHRmhoN/geqVoxmaH7OasKrJKcvrLphX54r7BTi76'
WHERE email IN ('marie@example.com', 'pierre@example.com', 'client@test.com');

-- Vérifier la mise à jour
SELECT email, 
       SUBSTRING(password_hash, 1, 20) as password_hash_prefix,
       role 
FROM customers 
ORDER BY email;
