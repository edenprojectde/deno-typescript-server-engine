import { open, save, DB } from "https://deno.land/x/sqlite/mod.ts";
import { Rows } from "https://deno.land/x/sqlite/src/rows.js";
import { IField } from "./IField.ts";

export default class Connection {
    dbcon: DB | undefined;

    constructor(path: string) {
        console.log(Deno.cwd()+path)
        open(Deno.cwd()+path).then((db)=>{
            this.dbcon=db;
            
        }).catch((reason)=>{console.log(reason)})
    }

    query(query:string, values:any): Rows | undefined {
        return this.dbcon?.query(query,values);
    }

    createTable(name: string,fields: Array<IField>): Promise<Rows> {
        return new Promise((resolve,reject)=>{
            if(!this.dbcon) reject('No Connection alive!')

            var tblstrings:Array<string>=[];
            fields.forEach((val,i)=>{
                tblstrings.push(val.name+" "+val.type+" "+(val.pk?"PRIMARY KEY":"")+" "+(val.ai?"AUTOINCREMENT":""));
            });

            resolve(this.dbcon?.query("CREATE TABLE IF NOT EXISTS "+name+"("+tblstrings.join(",")+")",[]));
        });
    }
    checkTableExists(tablename:string): Promise<boolean> {
        return new Promise((resolve,reject)=>{
        var sql=/*sql*/`SELECT name FROM sqlite_master WHERE type='table' AND name='${tablename}';`
        
        var rows=this.dbcon?.query(sql,[]);

        if(!!rows)
        for (const values of rows)
            {if(values && tablename==values[0]) resolve(true);}
        
        reject(false);
        });
    }
}