-- Create the schema PostgREST will expose
CREATE SCHEMA IF NOT EXISTS api;

-- Anon role (unauthenticated access)
DO $$ BEGIN
  CREATE ROLE anon NOLOGIN;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Authenticator role (used by PostgREST to connect)
DO $$ BEGIN
  CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'your_password';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

GRANT anon TO authenticator;

-- Grant usage on the api schema to anon
GRANT USAGE ON SCHEMA api TO anon;

-- Example table exposed via REST
CREATE TABLE IF NOT EXISTS api.todos (
  id      SERIAL PRIMARY KEY,
  task    TEXT NOT NULL,
  done    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anon to read/write the todos table
GRANT SELECT, INSERT , UPDATE, DELETE ON api.todos TO anon;

GRANT USAGE, SELECT ON SEQUENCE api.todos_id_seq TO anon;

-- Seed some sample data
INSERT INTO
    api.todos (task, done)
VALUES ('Buy groceries', false),
    (
        'Read the PostgREST docs',
        true
    ),
    ('Build a REST API', false);