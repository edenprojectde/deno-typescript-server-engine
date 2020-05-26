import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../../lib/io/file.ts";

export class FormtestComponent extends BaseComponent {
    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }
    async body(): Promise<FileData> {
        return new Promise((resolve,reject)=>{
            resolve(new FileData().setContent(`
            <form method="POST" action="/editor">
                <input type="text" name="tesval" value="testvalue">
                <input type="submit" name="SEND" value="send">
            </form>
            `))
        });
    }
}