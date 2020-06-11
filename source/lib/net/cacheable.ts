import { BaseDebugable } from "../BaseDebugable.ts";
import BaseField from "../sqllite/BaseField.ts";
import Connection from "../sqllite/Connection.ts";
import { connect } from "https://raw.githubusercontent.com/rahmanfadhil/cotton/master/mod.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { Model } from "https://deno.land/x/cotton/mod.ts";
import { UUID } from "../id/UUID.ts";

/*  TODO: Check full Database for files and delete files not in DB
    TODO: Make tasks to redownload files automatically.
*/

export class Cache extends BaseDebugable {
    static CachePath: string = Deno.cwd() + "/data/cache/";
    static FlatCachePath: string = Deno.cwd() + "/data/fcache/";
    private static DBConnection = new Connection("/data/db.sqlite");

    constructor() {
        super();
    }

    /**
     * Will load a file into Cache.
     * @param url Data to cache!
     */
    static storeFile(cachingrequest: CachingRequest): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await Cache.DBConnection.checkTableExists('cache')
                .catch(() => {
                    //console.log("TABLE DOES NOT EXIST")
                    Cache.DBConnection.createTable("cache", [
                        new BaseField('url').isUnique().setType("VARCHAR(2048)"),
                        new BaseField('validUntil').setType("UNSIGNED INTEGER(6)"),
                        new BaseField('localName').isUnique().setType("VARCHAR(256)"),
                    ]).then(() => {
                        //console.log("TABLE CREATED")
                    })
                })

            let db = await connect(Cache.DBConnection.connectionobj);

            let entry = await db.queryBuilder('cache')
                .select()
                .where('url', cachingrequest.url)
                .limit(1)
                .execute();

            //this.log(entry);

            db.disconnect();

            //this.log( (existsSync(this.FlatCachePath+entry[0].localName)?"Datei existiert.. ":"Datei existiert nicht.. "+this.FlatCachePath+entry[0].localName) )
            //this.log( entry[0].validUntil+" ist GRÖßER als ");
            //this.log(Date.now()+": "+(entry[0].validUntil > Date.now()) )
            //this.log( existsSync(this.FlatCachePath+entry[0].localName) && (entry[0].validUntil > Date.now()) )

            // If file exists AND is still valid just resolve().
            if (!!entry && entry.records.length==1 && existsSync(this.FlatCachePath+entry.records[0].localName) && entry.records[0].validUntil > Date.now()) {
                resolve();
            } else {
                /* Generate needed variables */
                /*                           */
                var pathWfilename = this.CachePath + cachingrequest.url.replace('http://', '').replace('https://', '');
                var splitPath = pathWfilename.split('/');
                var fileName = splitPath.pop();
                var fileExtension = ""

                if (!!fileName) {
                    var fileNameSplit = fileName.split('.');
                    if (fileNameSplit.length == 2)
                        fileExtension = "." + fileNameSplit[1];
                }
                /*                           */
                /*****************************/

                // Load cacheable file.
                var response: Response = await fetch(new URL(cachingrequest.url), {
                    method: cachingrequest.method,
                    headers: cachingrequest.headers,
                    body: cachingrequest.body
                });
                const decoder = new TextDecoder('utf-8');
                const bodyContent = decoder.decode(new Uint8Array(await response.arrayBuffer()));

                // Maybe needed in the future:
                // console.log(response.headers.get('content-type'))

                // Save cacheable file.
                ensureDirSync(splitPath.join('/'));
                ensureDirSync(this.FlatCachePath);
                Deno.writeTextFileSync(pathWfilename + ".cache", bodyContent);
                var flatFileName = UUID.generate(5) + fileExtension;
                Deno.writeTextFileSync(this.FlatCachePath + flatFileName, bodyContent);

                if(!!entry && entry.records.length==1 && !!entry.records[0].localName && existsSync(Cache.FlatCachePath+entry.records[0].localName)){
                    Deno.removeSync(this.FlatCachePath+entry.records[0].localName);
                }

                if (response.ok) {
                    var cachecontrol = response.headers.get('cache-control')
                    if (!!cachecontrol) {
                        let validUntilMoreFor = cachecontrol.split(', ').map((v) => {
                            var split = v.split('=');
                            return split;
                        }).filter((v) => v[0] == "max-age")[0][1]
                        let db = await connect(Cache.DBConnection.connectionobj);
                        db.execute(`REPLACE INTO cache(url, validUntil, localName)
                                        VALUES('`+ cachingrequest.url + `','` + (Date.now() + (Number(validUntilMoreFor)*1000)) + `','${flatFileName}')`)
                        await db.disconnect();
                    }
                    resolve();
                } else {
                    reject(false);
                }
            }
        });
    }

    /**
     * You can retrieve the Contents from a file you previously cached with this method.
     * @param url 
     */
    static async getContent(url: string): Promise<string> {
        return new Promise(async (resolve,reject)=>{
            let db = await connect(Cache.DBConnection.connectionobj);

            

            let entry = await db.queryBuilder('cache')
                .select()
                .where('url', url)
                .limit(1)
                .execute();
            
            db.disconnect();

            resolve(Deno.readTextFileSync(Cache.FlatCachePath+entry.records[0].localName));
        })
    }

    static async getContentAsObj(url: string): Promise<string | object> {
        return new Promise(async (resolve,reject)=>{
            let db = await connect(Cache.DBConnection.connectionobj);

            let entry = await db.queryBuilder('cache')
                .select()
                .where('url', url)
                .limit(1)
                .execute();
            
            db.disconnect();

            resolve(JSON.parse(Deno.readTextFileSync(Cache.FlatCachePath+entry.records[0].localName)));
        })
    }
    static async getContentAsInterfaced<T>(url: string): Promise<T> {
        return new Promise(async (resolve,reject)=>{
            let db = await connect(Cache.DBConnection.connectionobj);

            let entry = await db.queryBuilder('cache')
                .select()
                .where('url', url)
                .limit(1)
                .execute();
            
            db.disconnect();

            resolve(JSON.parse(Deno.readTextFileSync(Cache.FlatCachePath+entry.records[0].localName)) as T);
        })
    }
}



export class CachingRequest {
    url: string
    method: string = "GET"
    headers: Array<string[]> = []
    body: string = ""

    constructor(url: string){
        this.url=url;
    }
    
    setMethod(method: Method | string) {
        this.method=method;
        return this;
    }
    addHeader(name: string, value:string) {
        this.headers.push([name,value]);
        return this;
    }
    setBody(body: string) {
        this.body = body;
        return this;
    }
}
export enum Method {
    GET="GET",
    POST="POST"
}