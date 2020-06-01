import { BaseDebugable } from "../BaseDebugable.ts";
import BaseField from "../sqllite/BaseField.ts";
import Connection from "../sqllite/Connection.ts";
//import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";

export default class Cacheable extends BaseDebugable {
    CachePath: string = Deno.cwd() + "/data/cache/";
    private static DBConnection = new Connection("/data/db2.sqlite");

    constructor() {
        super();
        console.log("Hey?");
    }

    /**
     * Will load a file into Cache.
     * @param url Data to cache!
     */
    cache(url: string, method: string, headers: Array<string[]>, body: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            console.log("FINALLY")
            await Cacheable.DBConnection.checkTableExists('cache')
                .catch(() => {
                    console.log("TABLE DOES NOT EXIST")
                    Cacheable.DBConnection.createTable("cache", [
                        new BaseField('url').isUnique().setType("VARCHAR(2048)"),
                        new BaseField('validUntil').setType("UNSIGNED INTEGER(6)"),
                        new BaseField('localName').isUnique().setType("VARCHAR(256)"),
                    ]).then(() => {
                        console.log("TABLE CREATED")
                    })
                })

            await Cacheable.DBConnection.db;
            

            let sql = "SELECT validUntil FROM cache WHERE url='"+url+"'"

            console.log(sql);
            //let dbobj = await (await Cacheable.DBConnection.db).query(sql);
            //console.log(dbobj);

            if (!method) method = "GET";
            if (!headers) headers = [];
            if (!body) body = "";

            var pathWfilename = this.CachePath+url.replace('http://','').replace('https://','');
            var splitPath = pathWfilename.split('/');
            splitPath.pop();
            this.log(pathWfilename)
            this.log(splitPath)
            this.log(splitPath.join('/'))

            console.log("FINALLY 0")

            // Load cacheable file.
            var response: Response = await fetch(new URL(url), {
                method: method,
                headers: headers,
                body: body
            });
            var bodyContent = await response.text();

            // Save cacheable file.
            //ensureDirSync(splitPath.join('/'));
            //Deno.writeTextFileSync(pathWfilename+".cache",bodyContent);

            console.log("FINALLY 1");
            if (response.ok) {
                console.log("FINALLY 2")
                var cachecontrol = response.headers.get('cache-control')
                if (!!cachecontrol) {
                    this.log(cachecontrol.split(', ').map((v) => {
                        var split = v.split('=');
                        return split;
                    }).filter((v) => v[0] == "max-age")[0][1])
                    //let dbobj = await (await Cacheable.DBConnection.db).query(sql);
                }
                console.log("FINALLY 3")
                resolve();
                console.log("FINALLY 4")
            }
        });
    }

    /**
     * You can retrieve the Contents from a file you previously cached with this method.
     * @param url 
     */
    getContent(url: string): string | object {
        return "Empty";
    }
}

export class CachedFile {
    validUntil: number | undefined;
    url: string;

    constructor(url: string) {
        this.url = url;
    }
}