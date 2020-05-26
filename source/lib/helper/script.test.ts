import { getCurrentScriptname, getCurrentScriptnameWithoutExtension, getOtherFiletype, getFullPath, getPathOnly } from "./script.ts";
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";

Deno.test('GetCurrentScriptname', () => {
    assertEquals(getCurrentScriptname(import.meta.url), "script")
    assert(getCurrentScriptnameWithoutExtension(import.meta.url).indexOf('.')===-1)
  })