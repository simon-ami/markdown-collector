/**
 * Validate LLM endpoints before sending API credentials.
 * Only loopback servers may use unencrypted HTTP.
 */
export function validateLLMEndpoint(endpoint) {
  if (typeof endpoint !== "string" || !endpoint.trim()) {
    throw new Error("Enter an LLM API endpoint URL.");
  }

  let url;
  try {
    url = new URL(endpoint.trim());
  } catch {
    throw new Error("Enter a valid LLM API endpoint URL.");
  }

  if (url.username || url.password) {
    throw new Error("LLM endpoint URLs must not contain credentials.");
  }

  const loopbackHosts = ["localhost", "127.0.0.1", "[::1]"];
  const isLocalHTTP =
    url.protocol === "http:" &&
    loopbackHosts.includes(url.hostname.toLowerCase());

  if (url.protocol !== "https:" && !isLocalHTTP) {
    throw new Error(
      "LLM endpoints must use HTTPS. HTTP is allowed only for localhost, 127.0.0.1, or [::1]."
    );
  }

  return url.href;
}
