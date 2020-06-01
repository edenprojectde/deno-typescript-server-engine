import { connect } from "https://deno.land/x/cotton/mod.ts";
import { BaseAdapter } from "https://deno.land/x/cotton/src/baseadapter.ts";
import { IField } from "./IField.ts";

export default class Connection {
    //private _ba : BaseAdapter | undefined;


    path: string;

    constructor(path: string) {
        console.log("Init")
        this.path = Deno.cwd() + path;
    }

    get db(): Promise<BaseAdapter> {
        return new Promise(async (resolve, reject) => {
            var ba = await connect({
                type: "sqlite",
                database: this.path
            })
            //resolve(ba)
            
        });
    }

    createTable(name: string, fields: Array<IField>): Promise<void> {
        return new Promise(async (resolve, reject) => {

            var tblstrings: Array<string> = [];
            fields.forEach((val, i) => {
                tblstrings.push(val.name + " " + val.type + " " + (val.pk ? "PRIMARY KEY" : "") + " " + (val.unique ? "UNIQUE" : "") + " " + (val.ai ? "AUTOINCREMENT" : ""));
            });

            (await this.db).execute("CREATE TABLE IF NOT EXISTS " + name + "(" + tblstrings.join(",") + ")");

            resolve();
        });
    }
    dropTable(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            (await this.db).execute("DROP TABLE " + name);


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

                var rows = await (await this.db).query("SELECT " + idcolumnname + " FROM " + table + " WHERE " + idcolumnname + "=" + value);

                resolve(rows.length == 1);
            }
        });
    }

    checkTableExists(tablename: string): Promise<void> {
        return new Promise(async (resolve, reject) => {

            var sql =/*sql*/`SELECT name FROM sqlite_master WHERE type='table' AND name='${tablename}';`

            var rows = await (await this.db).query(sql);

            if (rows.length == 1) { resolve(); }
            else { reject(); }
        });
    }
}