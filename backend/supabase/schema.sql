
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
-- NOTE: In a real app, you'd check a 'role' claim or a profile table. 
-- For this MVP, we assume any authenticated user is an Admin (since registration is restrictive or we trust the user).
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

-- Guest Order Creation
-- Guests can INSERT orders, but usually can't SELECT them back (unless we use a session ID, out of scope).
-- They definitely can't UPDATE/DELETE.

create policy "Public can create orders"
    on orders for insert
    to anon, authenticated
    with check (true);

create policy "Public can create order items"
    on order_items for insert
    to anon, authenticated
    with check (true);

-- 4. SEED DATA (Optional, for testing)
insert into dishes (name, description, price, category, active) values
('Ultimate Cheese Burger', 'Double beef patty, cheddar cheese, fresh lettuce.', 12.99, 'Burgers', true),
('Classic Margherita', 'Authentic Italian style with fresh basil.', 14.50, 'Pizza', true),
('Crispy Fried Chicken', '3 pieces of golden crispy chicken.', 10.95, 'Chicken', true);

insert into menus (name, description) values
('Lunch', 'Available 11am - 3pm'),
('Dinner', 'Available 5pm - 10pm');

create policy "Public can view order items"
    on order_items for select
    to anon, authenticated
    using (true);