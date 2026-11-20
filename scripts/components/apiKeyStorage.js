/**
 * API key storage policy for Firefox.
 * Session storage is memory-only and unavailable to content scripts by default.
 * Persistent mode is an explicit convenience choice, NOT encryption.
 */
const KEY = "apiKey";
const MODE = "apiKeyStorageMode";
export const SESSION = "session";
export const PERSISTENT = "persistent";

export async function getApiKeyStorageMode() {
  const { apiKeyStorageMode, apiKey } = await browser.storage.local.get([
    MODE,
    KEY,
  ]);
  if (apiKeyStorageMode === SESSION || apiKeyStorageMode === PERSISTENT) {
    return apiKeyStorageMode;
  }
  // Preserve pre-1.4.5 users' existing key and behavior until they opt into
  // session-only storage. New installations default to session storage.
  return apiKey ? PERSISTENT : SESSION;
}

export async function getApiKey() {
  const mode = await getApiKeyStorageMode();
  const area = mode === SESSION ? browser.storage.session : browser.storage.local;
  const result = await area.get(KEY);
  return result.apiKey || "";
}

export async function saveApiKey(value) {
  const key = value.trim();
  const mode = await getApiKeyStorageMode();
  const target = mode === SESSION ? browser.storage.session : browser.storage.local;
  const other = mode === SESSION ? browser.storage.local : browser.storage.session;
  if (key) {
    await target.set({ [KEY]: key });
  } else {
    await target.remove(KEY);
  }
  await other.remove(KEY);
}

export async function setApiKeyStorageMode(mode, value) {
  if (mode !== SESSION && mode !== PERSISTENT) {
    throw new Error("Invalid API key storage mode");
  }

  const key = typeof value === "string" ? value.trim() : await getApiKey();
  const target = mode === SESSION ? browser.storage.session : browser.storage.local;
  const other = mode === SESSION ? browser.storage.local : browser.storage.session;

  // Write the new copy before deleting the old one, to avoid data loss if
  // storage.set fails. Only commit the mode after the target write succeeds.
  if (key) {
    await target.set({ [KEY]: key });
  } else {
    await target.remove(KEY);
  }
  await other.remove(KEY);
  // Commit the preference only after removing the old copy succeeds.
  await browser.storage.local.set({ [MODE]: mode });
}
