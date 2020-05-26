

import { BaseComponent } from "../../lib/BaseComponent.ts";
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../io/file.ts";

export class RowComponent extends BaseComponent {
    rowcomponents: Promise<string>[];

    constructor(rowcomponents: Promise<string>[]) {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);

        this.rowcomponents = rowcomponents;
    }
    body(): Promise<FileData> {
        return new Promise(async (resolve,reject)=>{
            var resolvedRowComponents = await Promise.all(this.rowcomponents);

            var resolved = "<div>"+resolvedRowComponents.join("</div><div>")+"</div>";
        })
    }
}