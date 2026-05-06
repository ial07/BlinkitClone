-- Optimization for QuickCart Recommendation Engine
-- This creates a Generalized Inverted Index (GIN) on the 'items' array column
-- in the 'orders' table. This drastically speeds up queries that search 
-- for orders containing specific items (e.g. `items @> '{"milk"}'`)

CREATE INDEX IF NOT EXISTS idx_orders_items_gin ON public.orders USING GIN (items);

-- Example query that will now use this index:
-- SELECT * FROM public.orders WHERE items @> '{"milk"}'::jsonb;
