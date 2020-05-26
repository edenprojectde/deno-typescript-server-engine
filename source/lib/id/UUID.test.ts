import { UUID } from "./UUID.ts";
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

Deno.test('UUID Length Check', () => {
    assert(UUID.generate(6).length==6)
    assert(UUID.generate(32).length==32)
  })