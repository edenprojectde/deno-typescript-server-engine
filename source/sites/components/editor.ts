import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/path.ts";
import { FileData } from "../../lib/io/file.ts";
import { Script, RessourceCollection, Position, Link } from "../../lib/io/ressource.ts";
import RequestData from "../../lib/RequestData.ts";
import { DebugComponent } from "../../lib/components/debug.ts";

export class EditorComponent extends BaseComponent {
    constructor() {
        super();
        this.scriptname = getCurrentScriptname(import.meta.url);
        this.path = getPathOnly(import.meta.url);
    }

    async body(args: RequestData): Promise<FileData> {
        return new Promise(async (resolve, reject) => {
            //var sessid = await args.session?.getID();

            // Componenten können jede Art von Datei returnen. 
            // TODO: Kleinere Klassen für API's ohne CSS&Ressourcen!
            resolve(new FileData().setContent(`
                <div class="editor-wrapper"><div id="editorjs"></div>
                <input id='refresh' type='button' value='REFRESH'></div>
                <test id='result'></test>
                <test id='resultHTML'></test>
                <test id='error'></test>`));
        });
            //+((await DebugComponent.asSubComponent(args)).content)));
   
    }

    ressources() : Promise<RessourceCollection> {
        return new Promise((resolve,reject)=>{
            // Lade Scripte! | Scripte werden bei Bedarf gecached später auch minified &| obfuscated!
            var RCol = new RessourceCollection()
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/header@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/quote@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/marker@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/warning@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/table@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/gh/paraswaykole/editor-js-code@latest/dist/bundle.js","EditorJS"))
                .add(new Script("./main.js","EditorJS").setPosition(Position.BodyBottom))
                .add(new Link("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap","stylesheet"))
            resolve(RCol);
        })
    }

    css() : Promise<string>{
        return new Promise( async (resolve,reject)=>{
            // Lädt CSS mit dem selben Dateinamen wie diesem.
            var fileCss = await this.loadFileCss();

            // Man kann manuell CSS hinzufügen!
            fileCss+=".customCss {border:black solid 1px;}"

            resolve(fileCss);
        });
    }
}
