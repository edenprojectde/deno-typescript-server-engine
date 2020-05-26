import { serve } from "https://deno.land/std@0.50.0/http/server.ts";

import { Index } from "./source/sites/index.ts";
import { BlogPage } from "./source/sites/blog.ts";
import { EditorPage } from "./source/sites/editor.ts";
import { SessionPage } from "./source/sites/session.ts";
import { BasePage } from "./source/lib/BasePage.ts";
import { StaticComponent } from "./source/lib/components/404.ts";
import RequestData from "./source/lib/RequestData.ts";
import Cookies from "./source/lib/Cookies.ts";
import Methods from "./source/lib/helper/method.ts";

const s = serve({ port: 8000 });
console.log("http://localhost:8000/");

var registeredPages = [
  new Index(),
  new BlogPage(),
  new EditorPage(),
  new SessionPage()
]

// Der StaticHandler sorgt dafür das statische Daten geladen werden & falls nichts gefunden wird eine 404 Seite angezeigt wird.
var StaticHandler = new StaticComponent()
                          .setStatic(true)
                          .setStaticPath("/static")
                          .setErrorMessage("Keine Seite/Datei ist unter diesem Pfad registriert.");

for await (const req of s) {
  console.time('PageCall of '+req.url);

  var CookieHeader = req.headers.get('Cookie')
  if(CookieHeader==null) CookieHeader="";

  var postdata :any = {};

  if(req.contentLength!=null)
  {
    const buf = new Uint8Array(req.contentLength);
    var c = req.body.read(buf);
    const text = new TextDecoder().decode(buf);

    if(req.headers.get("Content-Type") == "application/x-www-form-urlencoded")
      Methods.POST(text,req.headers.get("Content-Type"));
  }
  

  var page: undefined | BasePage = registeredPages.find((el) => el.matchingPathCheck(req.url)) //Finde Seite die matcht
  page?.body(new RequestData(req.url,undefined,undefined,Cookies.parse(CookieHeader),postdata,req.headers)) //Generiere Body
    .then(
      (pageanswer) => { 

        req.respond({ body: pageanswer.content, headers: pageanswer.header}); 
        console.timeEnd('PageCall of '+req.url);
      }
    ) // Sende Body (Ganze Seite)

  // Falls keine Seite gefunden wurde
  if (page == undefined) {
    StaticHandler.body(new RequestData(req.url,undefined,undefined,Cookies.parse(CookieHeader),postdata,req.headers)).then((resolved) => {
      if(typeof(resolved) == "string")
      { req.respond({ body: resolved }); console.timeEnd('PageCall of '+req.url); }
      else{
        var headers = new Headers();
        if(!!resolved.mime) headers.set('Content-Type',resolved.mime);
        req.respond({ body: resolved.content, headers: headers})

        console.timeEnd('PageCall of '+req.url);
      }
    }).catch((rejected)=>{
      req.respond({ body: rejected, status: 404 })

      console.timeEnd('PageCall of '+req.url);
    });
  }
}