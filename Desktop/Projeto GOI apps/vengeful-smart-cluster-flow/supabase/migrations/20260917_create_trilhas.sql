-- Migration: Catálogo de Trilhas (PostGIS / Supabase)
-- Arquivo: supabase/migrations/20260917_create_trilhas.sql

-- 1. Habilitar a extensão PostGIS para geoprocessamento
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Criar a tabela de trilhas com suporte a LineStringZ (3D com altitude)
CREATE TABLE IF NOT EXISTS public.trilhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  distancia_km NUMERIC(10, 2),
  ganho_elevacao_m NUMERIC(10, 2),
  dificuldade TEXT CHECK (dificuldade IN ('facil', 'moderada', 'dificil')),
  kml_path TEXT,
  geom GEOMETRY(LineStringZ, 4326),        -- Traçado completo 3D (lng, lat, alt)
  geom_preview GEOMETRY(LineString, 4326), -- Traçado simplificado p/ listagem
  ponto_inicio GEOMETRY(Point, 4326),      -- Ponto de origem p/ busca espacial
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar índices espaciais GIST para consultas ultra-rápidas
CREATE INDEX IF NOT EXISTS idx_trilhas_geom ON public.trilhas USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_trilhas_geom_preview ON public.trilhas USING GIST(geom_preview);
CREATE INDEX IF NOT EXISTS idx_trilhas_ponto_inicio ON public.trilhas USING GIST(ponto_inicio);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.trilhas ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública (todos os usuários podem visualizar)
CREATE POLICY "Leitura pública de trilhas"
  ON public.trilhas FOR SELECT
  USING (true);

-- Política de Escrita Restrita (apenas admin autenticado)
CREATE POLICY "Escrita restrita a administradores"
  ON public.trilhas FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') LIKE '%@vivo.com.br'
  );

-- 5. Função para Busca Espacial por Proximidade
CREATE OR REPLACE FUNCTION public.buscar_trilhas_proximas(
  lat_busca DOUBLE PRECISION,
  lng_busca DOUBLE PRECISION,
  raio_km DOUBLE PRECISION DEFAULT 50.0
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  descricao TEXT,
  distancia_km NUMERIC,
  ganho_elevacao_m NUMERIC,
  dificuldade TEXT,
  kml_path TEXT,
  geom_preview GEOMETRY,
  distancia_ponto_km NUMERIC,
  criado_em TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    t.id,
    t.nome,
    t.descricao,
    t.distancia_km,
    t.ganho_elevacao_m,
    t.dificuldade,
    t.kml_path,
    t.geom_preview,
    ROUND((ST_Distance(t.ponto_inicio::geography, ST_SetSRID(ST_MakePoint(lng_busca, lat_busca), 4326)::geography) / 1000.0)::numeric, 2) AS distancia_ponto_km,
    t.criado_em
  FROM public.trilhas t
  WHERE ST_DWithin(
    t.ponto_inicio::geography,
    ST_SetSRID(ST_MakePoint(lng_busca, lat_busca), 4326)::geography,
    raio_km * 1000.0
  )
  ORDER BY distancia_ponto_km ASC;
$$;
