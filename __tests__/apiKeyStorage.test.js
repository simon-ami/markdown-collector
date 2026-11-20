import { jest } from "@jest/globals";
import {
  getApiKeyStorageMode,
  getApiKey,
  saveApiKey,
  setApiKeyStorageMode,
} from "../scripts/components/apiKeyStorage.js";

function area(initial = {}) {
  const store = { ...initial };
  return {
    store,
    get: jest.fn(async (keys) => {
      const result = {};
      for (const key of Array.isArray(keys) ? keys : [keys]) {
        if (Object.prototype.hasOwnProperty.call(store, key)) result[key] = store[key];
      }
      return result;
    }),
    set: jest.fn(async (items) => Object.assign(store, items)),
    remove: jest.fn(async (key) => { delete store[key]; }),
  };
}

let local, session;
beforeEach(() => {
  local = area();
  session = area();
  global.browser = { storage: { local, session } };
});

test("new installs default to session storage", async () => {
  expect(await getApiKeyStorageMode()).toBe("session");
  await saveApiKey("  sk-test  ");
  expect(session.store.apiKey).toBe("sk-test");
  expect(local.store.apiKey).toBeUndefined();
});

test("legacy keys remain persistent after upgrade", async () => {
  local.store.apiKey = "sk-existing";
  expect(await getApiKeyStorageMode()).toBe("persistent");
  expect(await getApiKey()).toBe("sk-existing");
});

test("switching to session removes the persistent key", async () => {
  local.store.apiKey = "sk-existing";
  await setApiKeyStorageMode("session", "sk-existing");
  expect(local.store.apiKey).toBeUndefined();
  expect(local.store.apiKeyStorageMode).toBe("session");
  expect(await getApiKey()).toBe("sk-existing");
});

test("switching to persistent removes the session key", async () => {
  session.store.apiKey = "sk-session";
  await setApiKeyStorageMode("persistent", "sk-session");
  expect(session.store.apiKey).toBeUndefined();
  expect(local.store.apiKey).toBe("sk-session");
});

test("clearing the key removes it from both storage areas", async () => {
  session.store.apiKey = "sk-session";
  local.store.apiKey = "sk-old-stale";
  local.store.apiKeyStorageMode = "session";
  await saveApiKey("");
  expect(session.store.apiKey).toBeUndefined();
  expect(local.store.apiKey).toBeUndefined();
});

test("session keys disappear when the browser session ends", async () => {
  await saveApiKey("sk-session");
  session.store = {};
  global.browser.storage.session = area();
  expect(await getApiKey()).toBe("");
});

test("rejects unknown storage modes", async () => {
  await expect(setApiKeyStorageMode("auto", "sk-test")).rejects.toThrow();
});
