import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/path.ts";
import { FileData } from "../../lib/io/file.ts";
import RequestData from "../../lib/RequestData.ts";

export class SessionComponent extends BaseComponent {
    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
    }

    async body(args: RequestData): Promise<FileData> {
        return new Promise((resolve, reject) => {
            
            this.log(args);
            resolve(new FileData().setContent(`
                <div>${args.extra} : ${typeof(args)}</div>
            `));
        });
    }
}