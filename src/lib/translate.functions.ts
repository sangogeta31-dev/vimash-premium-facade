import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { translateTexts } from "@/lib/translate.server";

const schema = z.object({
  lang: z.enum(["hi", "gu", "mr"]),
  texts: z.array(z.string().min(1).max(2000)).max(600),
});

/** Public: translates a batch of UI strings into the requested language. */
export const translateBatch = createServerFn({ method: "POST" })
  .validator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    return translateTexts(data.lang, data.texts);
  });
