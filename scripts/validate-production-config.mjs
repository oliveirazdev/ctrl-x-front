const fail = (message) => {
  console.error(`::error::${message}`);
  process.exitCode = 1;
};

export function validateProductionUrl(value) {
  if (value === undefined || value === "") {
    return { error: "PRODUCTION_URL is unavailable. Set it under Settings > Environments > production > Environment variables." };
  }
  if (value !== value.trim() || /[\u0000-\u0020\u007f]/u.test(value)) {
    return { error: "PRODUCTION_URL contains whitespace or control characters. Store only the canonical HTTPS origin." };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return { error: "PRODUCTION_URL is not a valid absolute URL. Include the https:// protocol and hostname." };
  }

  if (url.protocol !== "https:") return { error: "PRODUCTION_URL must use HTTPS." };
  if (url.username || url.password) return { error: "PRODUCTION_URL must not contain credentials." };
  if (url.pathname !== "/") return { error: "PRODUCTION_URL must be an origin only; remove the path." };
  if (url.search) return { error: "PRODUCTION_URL must not contain a query string." };
  if (url.hash) return { error: "PRODUCTION_URL must not contain a fragment." };
  return { url };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1].replaceAll("\\", "/")}`).href) {
  const result = validateProductionUrl(process.env.PRODUCTION_URL);
  if (result.error) fail(result.error);
  else console.log("PRODUCTION_URL format is valid.");
}
