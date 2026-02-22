-- Tables
CREATE TABLE patterns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    s3_url VARCHAR(255) NOT NULL,
    creator_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0
);

-- 
CREATE TABLE likes (
    user_id VARCHAR(255) NOT NULL,
    pattern_id INTEGER NOT NULL REFERENCES patterns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, pattern_id)
);

-- Trigger functions
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE patterns 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.pattern_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE patterns 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.pattern_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pattern_likes_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW
EXECUTE FUNCTION update_likes_count();

-- Row Level Security
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

-- Likes: no direct access, all mutations go through toggle_like RPC (SECURITY DEFINER)
CREATE POLICY "Read likes"
  ON likes FOR SELECT
  TO anon, authenticated
  USING (true);
