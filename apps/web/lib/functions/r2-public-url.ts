export function buildR2PublicUrl(
  key: string,
  publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
) {
  const normalizedBase = publicBase?.trim().replace(/\/+$/, "");
  if (!normalizedBase) {
    throw new Error(
      "NEXT_PUBLIC_R2_PUBLIC_URL is required for browser-readable R2 uploads",
    );
  }

  const parsedBase = new URL(normalizedBase);
  if (parsedBase.protocol !== "https:" && parsedBase.protocol !== "http:") {
    throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL must be an HTTP(S) URL");
  }

  return `${normalizedBase}/${key.replace(/^\/+/, "")}`;
}
