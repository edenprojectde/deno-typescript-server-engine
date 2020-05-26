
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { getCurrentScriptname } from "../lib/helper/script.ts";

Deno.test('GetCurrentScriptname - in index', () => {
    assertEquals(getCurrentScriptname(import.meta.url), "index")
  })