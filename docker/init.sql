CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permisos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, resource, action)
);

CREATE TABLE IF NOT EXISTS archivos (
    id SERIAL PRIMARY KEY,
    file_id VARCHAR(255) UNIQUE NOT NULL,
    filename VARCHAR(500) NOT NULL,
    size BIGINT NOT NULL,
    owner_username VARCHAR(100) NOT NULL,
    checksum VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS nodos (
    node_id VARCHAR(100) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    port INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS eventos_auditoria (
    id SERIAL PRIMARY KEY,
    event_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp BIGINT NOT NULL,
    usuario VARCHAR(100),
    accion VARCHAR(100),
    recurso VARCHAR(255),
    resultado VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_archivo_id ON archivos(file_id);
CREATE INDEX IF NOT EXISTS idx_usuario ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_nodo_id ON nodos(node_id);
CREATE INDEX IF NOT EXISTS idx_evento_timestamp ON eventos_auditoria(timestamp);

INSERT INTO usuarios (username, password_hash, email) 
VALUES ('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLHJ7.Gi', 'admin@distributed.local')
ON CONFLICT DO NOTHING;

INSERT INTO permisos (user_id, resource, action, granted)
SELECT id, 'FILE', 'READ', TRUE FROM usuarios WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO permisos (user_id, resource, action, granted)
SELECT id, 'FILE', 'WRITE', TRUE FROM usuarios WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO permisos (user_id, resource, action, granted)
SELECT id, 'FILE', 'DELETE', TRUE FROM usuarios WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO permisos (user_id, resource, action, granted)
SELECT id, 'AUDIT', 'READ', TRUE FROM usuarios WHERE username = 'admin'
ON CONFLICT DO NOTHING;
