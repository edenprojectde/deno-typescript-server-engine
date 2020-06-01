import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../../lib/io/file.ts";
import RequestData from "../../lib/RequestData.ts";
import { RessourceCollection, Script, Meta, InlineScript } from "../../lib/io/ressource.ts";
import { validateJwt } from "https://deno.land/x/djwt/validate.ts"

export class GoogleloginComponent extends BaseComponent {
    clientId: string = "329320137301-nvpthc9m5882ud148ffuuj232g9shi7v.apps.googleusercontent.com"
    clientSecret: string = "7MJnPSayFRSVTG6uIQ_5YjnW"

    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }

    async body(args: RequestData): Promise<FileData> {
        return new Promise((resolve, reject) => {
            console.log(args.POST); //<- beinhaltet den Token

            resolve(new FileData().setContent(`
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
            `));
        });
    }

    ressources() : Promise<RessourceCollection> {
        return new Promise((resolve,reject)=>{
            var RCol = new RessourceCollection()
            //<meta name="google-signin-client_id" content="YOUR_CLIENT_ID.apps.googleusercontent.com">
                .add(new Meta("google-signin-client_id",this.clientId))
                .add(new Script("https://apis.google.com/js/platform.js","Google Login").setIsAsync().setIsDefer())
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
                `,"Google Login Token Handler"))
            resolve(RCol);
        })
    }
}