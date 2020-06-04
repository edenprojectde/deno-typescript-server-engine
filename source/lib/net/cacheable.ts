import { BaseDebugable } from "../BaseDebugable.ts";
import BaseField from "../sqllite/BaseField.ts";
import Connection from "../sqllite/Connection.ts";
import { connect } from "https://deno.land/x/cotton/mod.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { existsSync } from "https://deno.land/std/fs/exists.ts";
import { Model } from "https://deno.land/x/cotton/mod.ts";
import { UUID } from "../id/UUID.ts";

export default class Cacheable extends BaseDebugable {
    CachePath: string = Deno.cwd() + "/data/cache/";
    FlatCachePath: string = Deno.cwd() + "/data/fcache/";
    private static DBConnection = new Connection("/data/db.sqlite");

    constructor() {
        super();
    }

    /**
     * Will load a file into Cache.
     * @param url Data to cache!
     */
    cache(url: string, method: string, headers: Array<string[]>, body: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
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

            let db = await connect(Cacheable.DBConnection.connectionobj);


            let sql = "SELECT validUntil FROM cache WHERE url='" + url + "'"


            let entry = await db.queryBuilder('cache')
                .select()
                .where('url', url)
                .limit(1)
                .execute();

            this.log(entry);

            db.disconnect();

            this.log( (existsSync(this.FlatCachePath+entry[0].localName)?"Datei existiert.. ":"Datei existiert nicht.. "+this.FlatCachePath+entry[0].localName) )
            this.log( entry[0].validUntil+" ist GRÖßER als ");
            this.log(Date.now()+": "+(entry[0].validUntil > Date.now()) )
            this.log( existsSync(this.FlatCachePath+entry[0].localName) && (entry[0].validUntil > Date.now()) )

            if (existsSync(this.FlatCachePath+entry[0].localName) && entry[0].validUntil > Date.now()) {
                resolve();
            } else {
                
                //let dbobj = await (await Cacheable.DBConnection.db).query(sql);
                //console.log(dbobj);

                if (!method) method = "GET";
                if (!headers) headers = [];
                if (!body) body = "";

                var pathWfilename = this.CachePath + url.replace('http://', '').replace('https://', '');
                var splitPath = pathWfilename.split('/');
                var fileName = splitPath.pop();
                var fileExtension = ""

                if (!!fileName) {
                    var fileNameSplit = fileName.split('.');
                    if (fileNameSplit.length == 2)
                        fileExtension = "." + fileNameSplit[1];
                }


                // Load cacheable file.
                var response: Response = await fetch(new URL(url), {
                    method: method,
                    headers: headers,
                    body: body
                });
                const decoder = new TextDecoder('utf-8');
                const bodyContent = decoder.decode(new Uint8Array(await response.arrayBuffer()));

                //console.log(response.headers.get('content-type'))

                // Save cacheable file.
                ensureDirSync(splitPath.join('/'));
                ensureDirSync(this.FlatCachePath);
                Deno.writeTextFileSync(pathWfilename + ".cache", bodyContent);
                var flatFileName = UUID.generate(5) + fileExtension;
                Deno.writeTextFileSync(this.FlatCachePath + flatFileName, bodyContent);

                if (response.ok) {
                    var cachecontrol = response.headers.get('cache-control')
                    if (!!cachecontrol) {
                        let validUntilMoreFor = cachecontrol.split(', ').map((v) => {
                            var split = v.split('=');
                            return split;
                        }).filter((v) => v[0] == "max-age")[0][1]
                        let db = await connect(Cacheable.DBConnection.connectionobj);
                        db.execute(`REPLACE INTO cache(url, validUntil, localName)
                                        VALUES('`+ url + `','` + (Date.now() + (Number(validUntilMoreFor)*1000)) + `','${flatFileName}')`)
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
    getContent(url: string): string | object {
        return "Empty";
    }
}

export class CachedFile extends Model {
    static tableName = "cachedfiles";
    static fields = {
        url: String,
        localName: String,
        validUntil: Date,
    };

    validUntil!: Date;
    url!: string;
    localName!: string;
}