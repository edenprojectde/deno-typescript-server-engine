import { open, save, DB } from "https://deno.land/x/sqlite/mod.ts";
import { Rows } from "https://deno.land/x/sqlite/src/rows.js";
import { IField } from "./IField.ts";

export default class Connection {
    dbcon: DB | undefined;

    constructor(path: string) {
        open(Deno.cwd+path).then((db)=>{
            this.dbcon=db;
        })
    }
    query(query:string, values:any): Rows | undefined {
        return this.dbcon?.query(query,values);
    }

    createTable(name: string,fields: Array<IField>): Promise<null> {
        return new Promise((resolve,reject)=>{
            var tblstrings:Array<string>=[];
            fields.forEach((val,i)=>{
                tblstrings.push(val.name+" "+val.type+" "+(val.pk?"PRIMARY KEY":"")+" "+(val.ai?"AUTOINCREMENT":""));
            });

            this.dbcon?.query("CREATE TABLE "+name+"("+tblstrings.join(",")+")",[]);
        });
    }
}