-- ==============================================================================
-- GLOBAL BITES MENU - ANALYTICS SCHEMA
-- ==============================================================================

-- 1. CREATE TABLE
CREATE TABLE IF NOT EXISTS ai_analytics_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL CHECK (action IN ('generated', 'applied', 'discarded')),
    dish_id UUID REFERENCES dishes(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}', -- For any extra info like model name, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. ENABLE RLS
ALTER TABLE ai_analytics_logs ENABLE ROW LEVEL SECURITY;

-- 3. POLICIES
DROP POLICY IF EXISTS "Admins can do everything on ai_analytics_logs" ON ai_analytics_logs;

CREATE POLICY "Admins can do everything on ai_analytics_logs"
    ON ai_analytics_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_ai_analytics_logs_action ON ai_analytics_logs(action);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_logs_created_at ON ai_analytics_logs(created_at);
