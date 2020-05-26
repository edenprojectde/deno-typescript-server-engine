import { MimeChecker } from "./mime.ts";
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";

var mime = new MimeChecker();

Deno.test('MimeCheckerTests', () => {
    assertEquals(mime.getMime("test.js")?.mime, "application/javascript")
    assertEquals(mime.getMime("/pfad/im/string/test.js")?.mime, "application/javascript")
    assertEquals(mime.getMime("malorca.ts.js")?.mime, "application/javascript")
  })