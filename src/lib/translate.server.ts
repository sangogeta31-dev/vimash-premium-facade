const LANG_NAMES: Record<string, string> = {
  hi: "Hindi (Devanagari script)",
  gu: "Gujarati (Gujarati script)",
  mr: "Marathi (Devanagari script)",
};

export function isSupportedLang(lang: string): boolean {
  return lang in LANG_NAMES;
}

/** Fetches cached translations for the given language from the database. */
export async function readCache(lang: string, texts: string[]): Promise<Record<string, string>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const out: Record<string, string> = {};
  const chunkSize = 150;
  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    const { data } = await supabaseAdmin
      .from("site_translations")
      .select("source_text, translated_text")
      .eq("lang", lang)
      .in("source_text", chunk);
    for (const row of data ?? []) out[row.source_text] = row.translated_text;
  }
  return out;
}

async function writeCache(lang: string, pairs: Record<string, string>) {
  const rows = Object.entries(pairs).map(([source_text, translated_text]) => ({
    lang,
    source_text,
    translated_text,
  }));
  if (!rows.length) return;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("site_translations").upsert(rows, { onConflict: "lang,source_text" });
}

async function translateChunk(lang: string, texts: string[]): Promise<Record<string, string>> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return {};

  const system = `You are a professional translator for an Indian industrial machinery manufacturer (Vimash Manufacturing, maker of commercial atta chakki flour mills and masala pulverizers).
Translate each string from English into ${LANG_NAMES[lang]}.
Rules:
- Keep the brand name "Vimash" and model codes, numbers, units (HP, kg/hr, mm, ₹) unchanged.
- Keep translations short and natural so they fit the same UI space.
- Do not add explanations. Preserve leading/trailing punctuation.
- Return ONLY a JSON array of translated strings, in the exact same order and length as the input array.`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "google/gemini-3-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(texts) },
      ],
    }),
  });

  if (!res.ok) return {};
  const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = json.choices?.[0]?.message?.content ?? "";
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return {};
  }
  if (!Array.isArray(parsed) || parsed.length !== texts.length) return {};

  const out: Record<string, string> = {};
  texts.forEach((src, i) => {
    const value = parsed[i];
    if (typeof value === "string" && value.trim()) out[src] = value;
  });
  return out;
}

/** Returns translations for the requested strings, using the cache and filling gaps with AI. */
export async function translateTexts(
  lang: string,
  texts: string[],
): Promise<Record<string, string>> {
  if (!isSupportedLang(lang)) return {};
  const unique = Array.from(new Set(texts.map((t) => t.trim()).filter(Boolean))).slice(0, 600);
  if (!unique.length) return {};

  const cached = await readCache(lang, unique);
  const missing = unique.filter((t) => !cached[t]);

  const fresh: Record<string, string> = {};
  const chunkSize = 40;
  for (let i = 0; i < missing.length; i += chunkSize) {
    const chunk = missing.slice(i, i + chunkSize);
    Object.assign(fresh, await translateChunk(lang, chunk));
  }

  if (Object.keys(fresh).length) await writeCache(lang, fresh);
  return { ...cached, ...fresh };
}
