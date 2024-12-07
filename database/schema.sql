-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tables
CREATE TABLE patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    s3_url VARCHAR(255) NOT NULL,
    creator_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0
);

CREATE TABLE likes (
    user_id VARCHAR(255) NOT NULL,
    pattern_id UUID NOT NULL REFERENCES patterns(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, pattern_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_likes_user_id ON likes(user_id);

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
