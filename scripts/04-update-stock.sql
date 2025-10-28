-- Mise à jour du stock initial pour les produits existants
UPDATE products SET stock_quantity = 50 WHERE stock_quantity = 0;

-- Ajuster certains produits pour avoir un stock bas (pour tester les alertes)
UPDATE products SET stock_quantity = 3 
WHERE name LIKE '%Jouet%' 
LIMIT 2;

-- Mettre à jour quelques produits avec un bon stock
UPDATE products SET stock_quantity = 100 
WHERE name LIKE '%Collier%' OR name LIKE '%Laisse%' 
LIMIT 5;

-- Afficher le résumé du stock
SELECT 
    name,
    stock_quantity,
    CASE 
        WHEN stock_quantity = 0 THEN 'Rupture de stock'
        WHEN stock_quantity <= 5 THEN 'Stock bas'
        ELSE 'Stock OK'
    END as status
FROM products
ORDER BY stock_quantity ASC;
