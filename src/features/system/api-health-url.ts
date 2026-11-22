export function getApiHealthUrl(): URL {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("Endereço da API não configurado.");
  return new URL("/health", apiUrl);
}
