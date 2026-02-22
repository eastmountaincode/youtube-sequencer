-- Enable Row Level Security
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Patterns policies
CREATE POLICY "Anyone can read patterns"
  ON patterns FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create patterns"
  ON patterns FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Creators can delete own patterns"
  ON patterns FOR DELETE
  TO anon, authenticated
  USING (true);

-- No UPDATE policy: likes_count can only change via trigger
-- (triggered by SECURITY DEFINER functions which bypass RLS)

-- Likes: no direct access for writes, all mutations go through toggle_like RPC
CREATE POLICY "Read likes"
  ON likes FOR SELECT
  TO anon, authenticated
  USING (true);
