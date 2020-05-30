import { open, save, DB } from "https://deno.land/x/sqlite/mod.ts";
import { Rows } from "https://deno.land/x/sqlite/src/rows.js";
import { IField } from "./IField.ts";

export default class Connection {
    dbcon: DB | undefined;

    constructor(path: string) {
        console.log(Deno.cwd() + path)
        open(Deno.cwd() + path).then((db) => {
            this.dbcon = db;

        }).catch((reason) => { console.log(reason) })
    }

    query(query: string, values: any): Rows | undefined {
        var retval = this.dbcon?.query(query, values);
        
        if (!!this.dbcon)
            save(this.dbcon, undefined);
        return retval;
    }

    createTable(name: string, fields: Array<IField>): Promise<Rows> {
        return new Promise((resolve, reject) => {
            if (!this.dbcon) reject('No Connection alive!')

            var tblstrings: Array<string> = [];
            fields.forEach((val, i) => {
                tblstrings.push(val.name + " " + val.type + " " + (val.pk ? "PRIMARY KEY" : "") + " " + (val.unique ? "UNIQUE" : "") + " " + (val.ai ? "AUTOINCREMENT" : ""));
            });

            resolve(this.dbcon?.query("CREATE TABLE IF NOT EXISTS " + name + "(" + tblstrings.join(",") + ")", []));

            if (!!this.dbcon)
                save(this.dbcon, undefined);
        });
    }
    dropTable(name: string): Promise<Rows> {
        return new Promise((resolve, reject) => {
            if (!this.dbcon) reject('No Connection alive!')

            resolve(this.dbcon?.query("DROP TABLE " + name, []));

            if (!!this.dbcon)
                save(this.dbcon, undefined);
        });
    }
    /**
     * 
     * @param table Die Tabelle in der Datenbank
     * @param idcolumnname Der Name der column in der DB
     * @param value Der Wert nachdem gesucht wird, rejected falls undefined.
     */
    checkIdExists(table: string, idcolumnname: string | undefined, value: string | undefined): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!value) { reject('Undefined as Val is not valid'); return; }
            if (!this.dbcon) reject('No Connection alive!')

            var rows = this.dbcon?.query("SELECT " + idcolumnname + " FROM " + table + " WHERE " + idcolumnname + "=?", [value]);
            //console.log("SELECT " + idcolumnname + " FROM " + table + " WHERE " + idcolumnname + "=" + value)

            if(!!rows) {
            var result=rows.next();
            if (result.done) { reject("No Id!") }
            if (result.value && value == result.value[0]) { resolve(true); return; } else { reject(false); return; }
            } else {
                reject("Rows undefined")
            }

        });
    }

    checkTableExists(tablename: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            var sql =/*sql*/`SELECT name FROM sqlite_master WHERE type='table' AND name='${tablename}';`

            var rows = this.dbcon?.query(sql, []);

            if (!!rows)
                for (const values of rows) { if (values && tablename == values[0]) { resolve(true); return; } }

            reject(false);
        });
    }
}