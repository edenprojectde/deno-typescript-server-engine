import { IDebugable } from "./IDebugable.ts";

export class BaseDebugable implements IDebugable {
    scriptname: string;

    constructor() {
        this.scriptname = "!NO SCRIPTNAME!";
    }

    log(args:any) {
        console.log("[ "+this.scriptname+" ]", args)
    }
}