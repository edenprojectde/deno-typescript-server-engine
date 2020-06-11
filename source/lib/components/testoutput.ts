import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/path.ts";
import { FileData } from "../io/file.ts";
import RequestData from "../RequestData.ts";

export class TestOutput extends BaseComponent {
    public text: string;
    constructor(text: string) {
        super();
        this.text = text;
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }
    body(args: RequestData) : Promise<FileData> {
        return new Promise((resolve,reject)=>{
        
        resolve(new FileData().setContent("<div>" + this.text + "</div>"));
        });
    }
    async css(): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(html`
            .testOutput {

            }
                `);
        });
    }
    error() {
        return "";
    }
}