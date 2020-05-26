import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../../lib/io/file.ts";
import { Script, RessourceCollection, Position } from "../../lib/io/ressource.ts";
import RequestData from "../../lib/RequestData.ts";

export class EditorComponent extends BaseComponent {
    constructor() {
        super();
        this.scriptname = getCurrentScriptname(import.meta.url);
        this.path = getPathOnly(import.meta.url);
    }
    // TODO: Filter argument for blogpost to load single blogpost onto Page.
    // TODO: Make a Component to filter lists of blogposts
    // TODO: Make SQL Databinding directives.
    // TODO: Make a cache to not load everything a million times over ya dork.
    async body(args: RequestData): Promise<FileData> {
        return new Promise((resolve, reject) => {
            //this.log(args);
            var allHeaders = "";
            
            for (let entry of args.rawheaders) {
                allHeaders+=entry[0]+" : "+entry[1]+"<br>"
            }

            var fd = new FileData();
            if(!args.cookies["Cookies"]) {
                fd.headers.set("Set-Cookie","KEYNOTE=12")
            }


            resolve(fd.setContent(`
                <div id="editorjs"></div>
                <div class="customCss">${allHeaders}</div>
            `));
        });
    }
    ressources() : Promise<RessourceCollection> {
        return new Promise((resolve,reject)=>{
            var RCol = new RessourceCollection()
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest","EditorJS"))
                .add(new Script("./main.js","EditorJS").setPosition(Position.BodyBottom))
            resolve(RCol);
        })
    }
    css() : Promise<string>{
        return new Promise( async (resolve,reject)=>{
            var fileCss = await this.loadFileCss();

            fileCss+=".customCss {border:black solid 1px;} #editorjs {border:1px solid black;min-height:300px;background-color:grey;}"

            resolve(fileCss);
        });
    }
    error() {
        return "";
    }
}