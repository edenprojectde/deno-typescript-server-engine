import Connection from "../../lib/sqllite/Connection.ts";

import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getPathOnly } from "../../lib/helper/script.ts";
import { FileData } from "../../lib/io/file.ts";
import RequestData from "../../lib/RequestData.ts";

export class BlogMenu extends BaseComponent {
    db: Connection;

    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
        this.db = new Connection("/data/blog");
    }
    // TODO: Filter argument for blogpost to load dingle blogpost onto Page.
    // TODO: Make a Component to filter lists of blogposts
    // TODO: Make SQL Databinding directives.
    // TODO: Make a cache to not load everything a million times over ya dork.
    body(args: RequestData) : Promise<FileData> {
        return new Promise((resolve,reject)=>{
            this.log(args);
            resolve(new FileData().setContent("!Blogmenu!"));
        });
    }
    error() {
        return "";
    }
}