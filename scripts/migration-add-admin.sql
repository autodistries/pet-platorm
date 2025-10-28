-- Script de migration pour ajouter le support des rôles admin
-- À exécuter si vous avez déjà une base de données existante

-- Ajouter la colonne role si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='customers' 
        AND column_name='role'
    ) THEN
        ALTER TABLE customers 
        ADD COLUMN role VARCHAR(20) DEFAULT 'customer' 
        CHECK (role IN ('customer', 'admin'));
        
        -- Créer l'index
        CREATE INDEX idx_customers_role ON customers(role);
        
        RAISE NOTICE 'Colonne role ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne role existe déjà';
    END IF;
END $$;

-- Insérer un compte admin si aucun admin n'existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM customers WHERE role = 'admin') THEN
        INSERT INTO customers (id, name, email, password_hash, phone, role) 
        VALUES (
            '770e8400-e29b-41d4-a716-446655440000', 
            'Administrateur', 
            'admin@petshop.com', 
            '$2b$10$RZMrpooXsoYVrWcNaS.gx.r2gPxepBS8x8EPjmHH8H/Mz.ASJ.UJi', 
            '+33100000000', 
            'admin'
        )
        ON CONFLICT (email) DO NOTHING;
        
        RAISE NOTICE 'Compte administrateur créé : admin@petshop.com / Admin123!';
    ELSE
        RAISE NOTICE 'Un compte admin existe déjà';
    END IF;
END $$;

-- Afficher le résumé
SELECT 
    role,
    COUNT(*) as total_users
FROM customers
GROUP BY role
ORDER BY role;
