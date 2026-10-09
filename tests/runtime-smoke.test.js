import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient } from "@tanstack/react-query";
import { contactLinks, coverOf, plural } from "../src/lib/wtf.js";

test("QueryClient fetches and caches a profile result", async () => {
  const client = new QueryClient();
  let calls = 0;

  try {
    const result = await client.fetchQuery({
      queryKey: ["runtime-validation", "profile"],
      queryFn: async () => {
        calls += 1;
        return { id: "profile-1" };
      },
      staleTime: Infinity,
    });
    const cached = await client.fetchQuery({
      queryKey: ["runtime-validation", "profile"],
      queryFn: async () => {
        calls += 1;
        return { id: "profile-1" };
      },
      staleTime: Infinity,
    });

    assert.deepEqual(result, { id: "profile-1" });
    assert.deepEqual(cached, result);
    assert.equal(calls, 1);
  } finally {
    client.clear();
  }
});

test("contact links normalize handles into public URLs", () => {
  assert.deepEqual(
    contactLinks({ instagram: "@fashion", telegram: "https://t.me/fashion" }),
    [
      { label: "Instagram", value: "@fashion", href: "https://instagram.com/fashion" },
      { label: "Telegram", value: "https://t.me/fashion", href: "https://t.me/fashion" },
    ],
  );
});

test("portfolio cover falls back to avatar and plural forms are selected", () => {
  assert.equal(coverOf({ avatar_url: "/avatar.jpg" }), "/avatar.jpg");
  assert.equal(coverOf({ portfolio: [{ url: "/cover.jpg" }], avatar_url: "/avatar.jpg" }), "/cover.jpg");
  assert.equal(plural(1, ["год", "года", "лет"]), "год");
  assert.equal(plural(3, ["год", "года", "лет"]), "года");
  assert.equal(plural(11, ["год", "года", "лет"]), "лет");
});