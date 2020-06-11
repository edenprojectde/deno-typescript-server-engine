import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/path.ts";
import { FileData } from "../../lib/io/file.ts";
import RequestData from "../../lib/RequestData.ts";
import { RessourceCollection, Script, Meta, InlineScript } from "../../lib/io/ressource.ts";
import { CachingRequest, IGoogleKeys, Cache } from "../../lib/net/mod.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"
import { bgRed,bgGreen,bgCyan } from "https://deno.land/std/fmt/colors.ts";
import { decode } from "https://deno.land/std/encoding/base64.ts";
import {} from "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js";

export class GoogleloginComponent extends BaseComponent {
    clientId: string = "329320137301-nvpthc9m5882ud148ffuuj232g9shi7v.apps.googleusercontent.com"
    clientSecret: string = "7MJnPSayFRSVTG6uIQ_5YjnW"
    googleCertUrl: string = "https://www.googleapis.com/oauth2/v3/certs"
    constructor() {
        super();
        this.scriptname = getCurrentScriptname(import.meta.url);
        this.path = getPathOnly(import.meta.url);

        Cache.storeFile(new CachingRequest(this.googleCertUrl));
    }

    async body(args: RequestData): Promise<FileData> {
        return new Promise(async (resolve, reject) => {
            console.log(args.POST);
            if (!!args.POST && !!args.POST?.Data && !!args.POST?.Data.idtoken) {
                var output = await Cache.getContentAsInterfaced<IGoogleKeys>(this.googleCertUrl);
                console.log(output)
                var parts = args.POST.Data.idtoken.split('.')
                var header = atob(parts[0]);
                var payload = atob(parts[1]);
                var signature = atob(parts[2]);

                
                
                //console.log(await validateJwt(JSON.stringify(output.keys[1]),args.POST?.Data.idtoken))
                console.log(args.POST); //<- beinhaltet den Token
                var ans = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + args.POST?.Data['idtoken'])

                var response = await ans.json();


                // Validate Response:
                if(response.aud == this.clientId 
                    && (response.iss=="accounts.google.com" || response.iss=="https://accounts.google.com") 
                    && response.exp>Date.now()/1000){
                        // Set Google Object into Database bound to Session ID
                    //console.log(await validateJwt(JSON.stringify(output.keys[1]),response))
                }
                //----
                console.log(response); //<- beinhaltet den Token
            }
            resolve(new FileData().setContent(`
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
            `));
        });
    }

    ressources(): Promise<RessourceCollection> {
        return new Promise((resolve, reject) => {
            var RCol = new RessourceCollection()
                //<meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
                .add(new Meta("google-signin-client_id", this.clientId))
                .add(new Script("https://apis.google.com/js/platform.js", "Google Login").setIsAsync().setIsDefer())
                .add(new InlineScript(/*JS*/`
                function onSignIn(googleUser) {
                    var id_token = googleUser.getAuthResponse().id_token;
                    console.log("ID Token "+id_token);

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'http://localhost:8000/login');
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.onload = function() {
                      console.log('Signed in as: ' + xhr.responseText);
                    };
                    xhr.send('idtoken=' + id_token);

                  }
                `, "Google Login Token Handler"))
            resolve(RCol);
        })
    }
}