
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. ENUMS
create type order_status as enum ('pending', 'confirmed', 'completed', 'canceled');

-- 2. TABLES

-- DISHES
create table dishes (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    image text, -- URL to storage
    category text, -- e.g. 'Appetizer', 'Main'
    active boolean default true,
    pairing text,
    ingredient_suggestions text[],
    tags text[],
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- MENUS
create table menus (
    id uuid primary key default uuid_generate_v4(),
    name text not null, -- 'Lunch', 'Dinner'
    description text,
    active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- MENU_DISHES (N:N)
create table menu_dishes (
    id uuid primary key default uuid_generate_v4(),
    menu_id uuid references menus(id) on delete cascade,
    dish_id uuid references dishes(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(menu_id, dish_id)
);

-- ORDERS
create table orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id), -- Optional (null for guest checkout)
    status order_status default 'pending',
    total_price numeric(10, 2) default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ORDER_ITEMS
create table order_items (
    id uuid primary key default uuid_generate_v4(),
    order_id uuid references orders(id) on delete cascade,
    dish_id uuid references dishes(id), -- Keep reference even if dish is deleted? Usually better to maybe set null, but for menu integrity keep it.
    quantity integer not null check (quantity > 0),
    unit_price numeric(10, 2) not null, -- Snapshot of price at time of order
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. ROW LEVEL SECURITY (RLS)

-- Enable RLS
alter table dishes enable row level security;
alter table menus enable row level security;
alter table menu_dishes enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- POLICIES

-- Public Read Policies (Menu Access)
create policy "Public can view active dishes"
    on dishes for select
    using (active = true);

create policy "Public can view active menus"
    on menus for select
    using (active = true);

create policy "Public can view menu_dishes"
    on menu_dishes for select
    to anon, authenticated
    using (true);

-- Admin Full Access (Authenticated Users)
-- For MVP, any authenticated user can manage the menu.
create policy "Admins can do everything on dishes"
    on dishes for all
    to authenticated
    using (true)
    with check (true);

create policy "Admins can do everything on menus"
    on menus for all
    to authenticated
    using (true)
    with check (true);

create policy "Admins can do everything on menu_dishes"
    on menu_dishes for all
    to authenticated
    using (true)
    with check (true);

create policy "Admins can view all orders"
    on orders for select
    to authenticated
    using (true);

create policy "Admins can view all order items"
    on order_items for select
    to authenticated
    using (true);

create policy "Admins can update orders"
    on orders for update
    to authenticated
    using (true)
    with check (true);

-- Guest Order Creation
create policy "Public can create orders"
    on orders for insert
    to anon, authenticated
    with check (
        (auth.uid() = user_id) OR (user_id IS NULL)
    );

create policy "Public can create order items"
    on order_items for insert
    to anon, authenticated
    with check (
        exists (
            select 1 from orders
            where orders.id = order_id
        )
    );


-- 4. SEED DATA (Optional)
insert into dishes (name, description, price, category, active, image) values
('Ultimate Cheese Burger', 'Double beef patty, cheddar cheese, fresh lettuce.', 12.99, 'Burgers', true, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60'),
('Classic Margherita', 'Authentic Italian style with fresh basil.', 14.50, 'Pizza', true, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60'),
('Crispy Fried Chicken', '3 pieces of golden crispy chicken.', 10.95, 'Chicken', true, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=60'),
('Fresh Salad', 'Fresh lettuce, tomatoes, cucumbers.', 8.99, 'Salad', true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=60'),
('Chocolate Cake', 'Decadent chocolate cake.', 6.99, 'Dessert', true, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=60'),
('Soda', 'Refreshing soda.', 2.99, 'Drinks', true, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60');

insert into menus (name, description) values
('Lunch', 'Available 11am - 3pm'),
('Dinner', 'Available 5pm - 10pm');

-- Link some dishes to menus (assuming UUIDs are generated, we can't easily do this in SQL file without variables, 
-- but this file is for the user to run in SQL Editor)

-- ==============================================================================
-- GLOBAL BITES MENU - SUPABASE FIXES
-- ==============================================================================
-- This script fixes schema issues and configures Row-Level Security (RLS) policies.
-- Run this in the Supabase SQL Editor.

-- ==============================================================================
-- 1. ADD MISSING COLUMNS
-- ==============================================================================
-- Ensure the dishes table has all columns expected by the frontend (DishForm.tsx).

-- Add 'ingredients' as an array of text (used for technical ingredients list)
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS ingredients TEXT[] DEFAULT '{}';

-- Add 'pairing' as text (used for Chef's Pairing)
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS pairing TEXT DEFAULT '';

-- Add 'ingredient_suggestions' as an array of text (used for Creative Enhancements)
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS ingredient_suggestions TEXT[] DEFAULT '{}';

-- Add 'tags' as an array of text (used for UI Badges like "Spicy", "Vegetarian")
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- ==============================================================================
-- 2. ENABLE ROW-LEVEL SECURITY (RLS)
-- ==============================================================================
-- Ensure RLS is enabled on all tables to prevent default public access (secure by default).

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. CONFIGURE RLS POLICIES FOR TABLES
-- ==============================================================================
-- We drop existing policies first to facilitate re-runs of this script.

-- --- DISHES ---
DROP POLICY IF EXISTS "Public Read Dishes" ON dishes;
DROP POLICY IF EXISTS "Auth Write Dishes" ON dishes;

-- Anyone (anon/auth) can READ dishes
CREATE POLICY "Public Read Dishes" ON dishes FOR SELECT USING (true);

-- Only Authenticated users can INSERT/UPDATE/DELETE dishes
CREATE POLICY "Auth Write Dishes" ON dishes FOR ALL USING (auth.role() = 'authenticated');


-- --- MENUS ---
DROP POLICY IF EXISTS "Public Read Menus" ON menus;
DROP POLICY IF EXISTS "Auth Write Menus" ON menus;

CREATE POLICY "Public Read Menus" ON menus FOR SELECT USING (true);
CREATE POLICY "Auth Write Menus" ON menus FOR ALL USING (auth.role() = 'authenticated');


-- --- MENU_DISHES (Join Table) ---
DROP POLICY IF EXISTS "Public Read MenuDishes" ON menu_dishes;
DROP POLICY IF EXISTS "Auth Write MenuDishes" ON menu_dishes;

CREATE POLICY "Public Read MenuDishes" ON menu_dishes FOR SELECT USING (true);
CREATE POLICY "Auth Write MenuDishes" ON menu_dishes FOR ALL USING (auth.role() = 'authenticated');


-- --- ORDERS & ORDER_ITEMS ---
DROP POLICY IF EXISTS "Public Create Orders" ON orders;
DROP POLICY IF EXISTS "Auth Manage Orders" ON orders;
DROP POLICY IF EXISTS "Public Create OrderItems" ON order_items;
DROP POLICY IF EXISTS "Auth Manage OrderItems" ON order_items;

-- Anyone can create an order
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);
-- Authenticated users (Admins) can do everything
CREATE POLICY "Auth Manage Orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- Anyone can create order items
CREATE POLICY "Public Create OrderItems" ON order_items FOR INSERT WITH CHECK (true);
-- Authenticated users (Admins) can do everything
CREATE POLICY "Auth Manage OrderItems" ON order_items FOR ALL USING (auth.role() = 'authenticated');


-- ==============================================================================
-- 4. CONFIGURE STORAGE (Dishes Bucket)
-- ==============================================================================

-- Create the 'dishes' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('dishes', 'dishes', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for the 'dishes' bucket
-- Note: Storage policies are on the 'storage.objects' table.

DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete Images" ON storage.objects;

-- 1. Public Read Access
CREATE POLICY "Public Access Images" ON storage.objects
FOR SELECT USING ( bucket_id = 'dishes' );

-- 2. Authenticated Upload (Insert)
CREATE POLICY "Auth Upload Images" ON storage.objects
FOR INSERT WITH CHECK ( bucket_id = 'dishes' AND auth.role() = 'authenticated' );

-- 3. Authenticated Update
CREATE POLICY "Auth Update Images" ON storage.objects
FOR UPDATE USING ( bucket_id = 'dishes' AND auth.role() = 'authenticated' );

-- 4. Authenticated Delete
CREATE POLICY "Auth Delete Images" ON storage.objects
FOR DELETE USING ( bucket_id = 'dishes' AND auth.role() = 'authenticated' );

-- End of Fix Script
