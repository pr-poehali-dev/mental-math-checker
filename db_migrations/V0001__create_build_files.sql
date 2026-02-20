CREATE TABLE build_files (
    id SERIAL PRIMARY KEY,
    commit_hash VARCHAR(40),
    file_path TEXT NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);