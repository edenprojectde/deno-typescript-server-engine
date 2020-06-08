import { IGoogleKeys, CachingRequest, Cache } from "./mod.ts";
var url = "https://www.googleapis.com/oauth2/v3/certs"



Deno.test('Test', async () => {
  //console.log("TEST")
  var ca = new Cache();

  await Cache.storeFile(new CachingRequest(url));
  var output = await Cache.getContentAsInterfaced<IGoogleKeys>(url);

  console.log(output.keys[0].alg);
  return;
})

/*
Deno.test('UUID Length Check', () => {
    assert(UUID.generate(6).length==6)
    assert(UUID.generate(32).length==32)
  })*/