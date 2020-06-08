import { DBSession } from "./Session.ts";
import { assertEquals, assert } from "https://deno.land/std/testing/asserts.ts";



Deno.test('SessionTests', () => {
    var ses = new DBSession("DEBUGSESSID");
    ses.openSession().then(async(sesStore)=>{
      sesStore.store("{test:1}");
      await ses.deleteSession();
    });

    
  })