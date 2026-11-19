import { validateLLMEndpoint } from "../scripts/components/endpointSecurity.js";

describe("LLM endpoint security", () => {
  test.each([
    "https://api.openai.com/v1/chat/completions",
    "https://example.com:8443/v1",
    "http://localhost:1234/v1/chat/completions",
    "http://127.0.0.1:11434/v1",
    "http://[::1]:8080/v1",
  ])("accepts HTTPS and loopback HTTP: %s", (endpoint) => {
    expect(validateLLMEndpoint(endpoint)).toBe(new URL(endpoint).href);
  });

  test.each([
    "http://api.openai.com/v1/chat/completions",
    "http://192.168.1.12:8080/v1",
    "http://localhost.evil.com:8000/v1",
    "ftp://localhost/file",
    "https://user:secret@example.com/v1",
    "not a url",
    "",
  ])("rejects insecure or invalid endpoints: %s", (endpoint) => {
    expect(() => validateLLMEndpoint(endpoint)).toThrow();
  });
});
