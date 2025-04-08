import { z } from "zod";

export const promptWithConfigGenSchema = z.object({
  title: z.string(),
  description: z.string(),
  stringTemplate: z.string(),
  systemInstruction: z.string(),
  configs: z.array(
    z
      .object({
        label: z.string(),
        type: z.enum(["dropdown", "textarea", "combobox", "array"]),
      })
      .extend({
        values: z.array(
          z.object({
            value: z.string(),
          })
        ),
      })
  ),
});
