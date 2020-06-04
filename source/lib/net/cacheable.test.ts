import Cacheable from "./cacheable.ts";
var getFile = "https://www.googleapis.com/oauth2/v3/certs"



Deno.test('Test', async () => {
  console.log("TEST")
  var ca = new Cacheable();

  await ca.cache(getFile,"GET",[],"");

  return;
})

/*
Deno.test('UUID Length Check', () => {
    assert(UUID.generate(6).length==6)
    assert(UUID.generate(32).length==32)
  })*/