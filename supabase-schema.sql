-- 1. Crear tabla de iniciativas
CREATE TABLE initiatives (
  id INT8 PRIMARY KEY,
  title TEXT NOT NULL,
  shortDescription TEXT,
  fullDescription TEXT,
  budget INT8,
  timeline TEXT,
  priority TEXT,
  category TEXT,
  icon TEXT,
  imageUrl TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Crear tabla de configuración para lastUpdated
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 3. Insertar valor inicial para lastUpdated
INSERT INTO settings (key, value) VALUES ('lastUpdated', '03 de marzo de 2026');

-- 4. Habilitar RLS (Opcional por ahora para facilitar, pero recomendado)
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas para permitir lectura/escritura pública (Para este proyecto interno)
CREATE POLICY "Public Read" ON initiatives FOR SELECT USING (true);
CREATE POLICY "Public Write" ON initiatives FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON initiatives FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON initiatives FOR DELETE USING (true);

CREATE POLICY "Public Read Settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public Update Settings" ON settings FOR UPDATE USING (true);
CREATE POLICY "Public Insert Settings" ON settings FOR INSERT WITH CHECK (true);
