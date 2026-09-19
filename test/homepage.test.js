import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import handler from "../functions/index.js";

test("the homepage function renders the current template unchanged", async () => {
  const expectedHtml = await readFile(
    new URL("../templates/index.html", import.meta.url),
    "utf8",
  );
  const headers = new Map();
  const response = {
    body: undefined,
    statusCode: undefined,
    setHeader(name, value) {
      headers.set(name.toLowerCase(), value);
      return this;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };

  handler({}, response);

  assert.equal(response.statusCode, 200);
  assert.equal(headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(response.body, expectedHtml);
});
