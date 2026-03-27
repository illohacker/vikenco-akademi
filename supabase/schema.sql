-- Quiz results
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  language text NOT NULL DEFAULT 'no',
  quiz_id text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  percentage numeric GENERATED ALWAYS AS (CASE WHEN total > 0 THEN (score::numeric / total * 100) ELSE 0 END) STORED,
  created_at timestamptz DEFAULT now()
);

-- Index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_quiz_results_percentage ON quiz_results (percentage DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz_id ON quiz_results (quiz_id);

-- Enable RLS
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON quiz_results FOR INSERT WITH CHECK (true);

-- Allow anonymous reads
CREATE POLICY "Allow anonymous reads" ON quiz_results FOR SELECT USING (true);

-- Analytics events
CREATE TABLE IF NOT EXISTS events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type text NOT NULL,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous reads" ON events FOR SELECT USING (true);
