-- Drop existing cart-related tables if they exist
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;

-- Create cart items table for user-specific shopping carts
-- Each user has their own cart with items directly linked to customer_id

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customer_id, product_id)  -- One entry per product per customer
);

-- Create indexes for faster queries
CREATE INDEX idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Display structure
\d cart_items

-- Show existing cart items
SELECT 
    ci.id,
    c.name as customer_name,
    c.email,
    p.name as product_name,
    ci.quantity,
    ci.created_at
FROM cart_items ci
JOIN customers c ON ci.customer_id = c.id
JOIN products p ON ci.product_id = p.id
ORDER BY ci.created_at DESC;
