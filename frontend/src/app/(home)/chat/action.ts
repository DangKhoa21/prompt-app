"use server";

import { cookies } from "next/headers";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";

export async function saveModelId(model: string) {
  const cookieStore = cookies();
  cookieStore.set("model-id", model);
}

export async function loadSavedModelId() {
  const cookieStore = cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;
  return selectedModelId;
}
