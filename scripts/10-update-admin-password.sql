-- Correction du mot de passe admin
-- Le hash ci-dessous a été généré avec bcrypt pour le mot de passe: Admin123!

UPDATE customers
SET password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@petshop.com';

-- Vérification
SELECT id, name, email, role FROM customers WHERE email = 'admin@petshop.com';
