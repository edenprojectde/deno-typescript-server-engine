import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../io/file.ts";
import RequestData from "../RequestData.ts";

export class DebugComponent extends BaseComponent {
    constructor(text: string) {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }
    async body(): Promise<FileData> {
        return new Promise((res,rej)=>{
            return new FileData();
        })
    }

    static asSubComponent(args: RequestData): FileData {
        var allHeaders = "";

        for (let entry of args.rawheaders) {
            allHeaders+=entry[0]+" : "+entry[1]+"<br>"
        }

        args.session?.SessionStorage.setData("DEBUG TEST","SUCCESSSU")

        return new FileData()
                    .setContent(/*html*/`
                        <div>Headers:<br>${allHeaders}</div>
                        <div>${JSON.stringify(args.session?.SessionStorage.LData)}</div>
                    
                    `);
    }
}