import { exists } from 'https://deno.land/std/fs/exists.ts';
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { IComponent } from "./IComponent.ts";
import { IRessource, RessourceCollection } from "./io/ressource.ts";
import { UUID } from "./id/UUID.ts";
import { getCurrentScriptname, getPathOnly } from "./helper/script.ts";
import { BaseDebugable } from './BaseDebugable.ts';
import { FileData } from './io/file.ts';
import RequestData from './RequestData.ts';

export abstract class BaseComponent extends BaseDebugable implements IComponent {
    uuid: string;
    scriptname: string;
    path: string;
    childs: Promise<string>[];
    headElements: Array<string>;

    constructor() {
        super();
        this.uuid = UUID.generate(6);
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);
        this.childs=[];
        this.headElements=[];
    }
    /**
     * The default will just use this.loadFileCss().
     * 
     * You can override it or mix them by returning a Promise which resolves the File(with the loadFileCss Method) and add your own custom in the Component class or just do one of the two.
     */
    async css(args: RequestData): Promise<string> {
        return this.loadFileCss()
    }
    public loadFileCss(): string | Promise<string> {
        return new Promise(async (resolve, reject) => {
            var cssPath = this.path + "dist/" + this.scriptname + ".min.css";

            exists(cssPath).then((doesExist) => {
                if (doesExist) {
                    //console.log(cssPath+" does exist.. trying to read!")
                    const decoder = new TextDecoder('utf-8');
                    const text = decoder.decode(Deno.readFileSync(cssPath));

                    resolve(text);
                }
                else {
                    //console.log(cssPath+" does not exist..!"); resolve("does not succ :D");
                    resolve("");
                }
            }).catch(() => {
                //console.log(cssPath+" does not exist..!"); resolve("");
                resolve("");
            });
        });
    }

    getMyScriptname(){
        return getCurrentScriptname(import.meta.url);
    }
    abstract body(args: RequestData): Promise<FileData> 

    ressources(args: RequestData): Promise<RessourceCollection | undefined> {
        return new Promise((r)=>r(undefined));
    }

    header(args: RequestData): Promise<Headers | undefined> {
        return new Promise((r)=>r(undefined));
    }

    error(): string {
        throw new Error("Method not implemented.");
    }
    
    static asSubComponent(args: RequestData) : Promise<FileData> {
        throw new Error("Method not implemented.");
    }
}