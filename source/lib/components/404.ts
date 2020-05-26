import { exists } from 'https://deno.land/std/fs/exists.ts';
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";

import { BaseComponent } from "../../lib/BaseComponent.ts";
import html from '../../lib/helper/html.ts'
import { getCurrentScriptname, getFilename, getPathOnly } from "../../lib/helper/script.ts";
import { MimeChecker } from '../helper/mime.ts';
import { FileData } from '../io/file.ts';
import RequestData from '../RequestData.ts';


export class StaticComponent extends BaseComponent {
    message: string;
    args: string;
    staticEnabled: boolean;
    staticPath: string;

    constructor() {
        super();
        this.scriptname=getCurrentScriptname(import.meta.url);
        this.path=getPathOnly(import.meta.url);

        this.message="ERROR (No error Message set!!)";
        this.args="";
        this.staticEnabled=false;
        this.staticPath="/static";
    }
    // TODO: Filter argument for blogpost to load dingle blogpost onto Page.
    // TODO: Make a Component to filter lists of blogposts
    // TODO: Make SQL Databinding directives.
    // TODO: Make a cache to not load everything a million times over ya dork.

    /**
     * Falls static enabled: Promise ist fullfilled wenn die Datei gefunden wurde. Reject bei Fehler.
     * Falls static nicht enabled: Promise wird IMMER rejecten.
     * @param args string
     */
    async body(args: RequestData) : Promise<FileData> {
        return new Promise((resolve,reject)=>{
            this.args=args.url;
            if(this.staticEnabled)
            this.tryStatic().then((file)=>{
                this.log("Found in statics!");
                
                resolve(file);
            }).catch(()=>{
                reject(this.message);
            });
            else reject(this.message);
        })
    }

    private tryStatic() : Promise<FileData> {
        return new Promise(async (resolve, reject) => {
            var staticPath = Deno.cwd()+this.staticPath+this.args;

            exists(staticPath).then((doesExist)=>{
                if(doesExist){
                //console.log(cssPath+" does exist.. trying to read!")
                const decoder = new TextDecoder('utf-8');
                const text = decoder.decode(Deno.readFileSync(staticPath));
                
                resolve(new FileData().setContent(text).setFilename(staticPath));
                }else {
                    //console.log(cssPath+" does not exist..!"); resolve("does not succ :D");
                    reject();
                }
            }).catch(()=>{
                //console.log(cssPath+" does not exist..!"); resolve("");
                reject();
            })
        })
    }
    setStatic(bool:boolean) {
        this.staticEnabled=bool;
        return this;
    }
    /**
     * Setze den Statischen Dateipfad der in dieser Component benutzt werden sollte. Relativ zum CWD mit leading slash.
     * @param path string
     */
    setStaticPath(path:string) {
        this.staticPath="/static";
        return this;
    }
    setErrorMessage(msg:string) {
        this.message = msg;
        return this; 
    }
    error() {
        return "";
    }
}

