export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";
export const VERSION_PREFIX =
  process.env.NEXT_PUBLIC_VERSION_PREFIX ?? "api/v1";
export const WEB_URL =
  process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export const PAGE_LIMIT = 9;

export const EXTENSION_URL =
  process.env.NEXT_PUBLIC_EXTENSION_URL ??
  "https://chromewebstore.google.com/detail/khbfmkpndingocghhjokedihgmbnagml?utm_source=item-share-cb";
export const EXTENSION_INSTALLED_KEY =
  process.env.NEXT_PUBLIC_EXTENSION_INSTALLED_KEY ?? "extension_installed";

export const IS_PRODUCTION =
  process.env.NODE_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";
