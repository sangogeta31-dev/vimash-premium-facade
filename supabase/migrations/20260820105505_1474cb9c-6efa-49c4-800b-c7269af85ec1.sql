CREATE TABLE public.site_translations (
  id uuid primary key default gen_random_uuid(),
  lang text not null,
  source_text text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  unique (lang, source_text)
);
GRANT SELECT ON public.site_translations TO anon;
GRANT SELECT ON public.site_translations TO authenticated;
GRANT ALL ON public.site_translations TO service_role;
ALTER TABLE public.site_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read translations" ON public.site_translations FOR SELECT TO anon, authenticated USING (true);