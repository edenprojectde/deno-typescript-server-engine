import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/path.ts";
import { FileData } from "../../lib/io/file.ts";
import RequestData from "../../lib/RequestData.ts";

export class TopMenu extends BaseComponent {
    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }
    body(args: RequestData) : Promise<FileData> {
        return new Promise((resolve,reject)=>{
        //this.log(args);
        resolve(new FileData().setContent(/*html*/`
            <div id='topmenu' class='horizontal'>
                <a href='/'>Main Page</a>
                <a href='/blog?testseite'>Testseite</a>
                <a href='/editor'>Editor</a>
                <a href='/session'>Session</a>
                <a href='/login'>Login</a>
            </div>`));
        });

    }
    error() {
        return "";
    }
}