-- Add role column to customers table
ALTER TABLE customers 
ADD COLUMN role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- Update admin user to have admin role
UPDATE customers 
SET role = 'admin' 
WHERE email = 'admin@petshop.com';

-- Verify the update
SELECT id, name, email, role FROM customers ORDER BY email;
