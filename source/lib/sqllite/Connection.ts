import { connect } from "https://raw.githubusercontent.com/rahmanfadhil/cotton/master/mod.ts";
import { IField } from "./IField.ts";
import { ensureDirSync } from "https://deno.land/std/fs/ensure_dir.ts";
import { getPathOnly } from "../helper/path.ts";

export default class Connection {
    //private _ba : BaseAdapter | undefined;


    connectionobj: any;

    constructor(path: string) {
        ensureDirSync(getPathOnly(Deno.cwd() + path));
        this.connectionobj = {
            type: "sqlite",
            database: Deno.cwd() + path
        };
    }

    createTable(name: string, fields: Array<IField>): Promise<void> {
        return new Promise(async (resolve, reject) => {

            var tblstrings: Array<string> = [];
            fields.forEach((val, i) => {
                tblstrings.push(val.name + " " + val.type + " " + (val.pk ? "PRIMARY KEY" : "") + " " + (val.unique ? "UNIQUE" : "") + " " + (val.ai ? "AUTOINCREMENT" : ""));
            });

            var db = await connect(this.connectionobj)
            await db.execute("CREATE TABLE IF NOT EXISTS " + name + "(" + tblstrings.join(",") + ")");
            await db.disconnect();
            resolve();
        });
    }
    dropTable(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            var db = await connect(this.connectionobj)
            await db.execute("DROP TABLE " + name);
            await db.disconnect();

            resolve();
        });
    }
    /**
     * 
     * @param table Die Tabelle in der Datenbank
     * @param idcolumnname Der Name der column in der DB
     * @param value Der Wert nachdem gesucht wird, rejected falls undefined.
     */
    checkIdExists(table: string, idcolumnname: string | undefined, value: string | undefined): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) { reject('Undefined as Val is not valid'); }
            else {
                var db = await connect(this.connectionobj)
                var rows = await db.query("SELECT " + idcolumnname + " FROM " + table + " WHERE " + idcolumnname + "='" + value+"'");


                //console.log(rows);
                if(rows.records.length==1)
                    resolve(rows.records.length == 1);
                else if (rows.records.length==0){
                    reject("No entry with this Id")
                } else { reject ("Too many IDs"); }
                await db.disconnect();
            }
        });
    }

    checkTableExists(tablename: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            var db = await connect(this.connectionobj)
            var sql =/*sql*/`SELECT name FROM sqlite_master WHERE type='table' AND name='${tablename}';`

            var rows = await db.query(sql);

            if (rows.records.length == 1) { resolve(); }
            else { reject(); }
            await db.disconnect();
        });
    }
}