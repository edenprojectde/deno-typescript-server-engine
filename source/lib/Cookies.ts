import { KVP } from "./datatypes/kvp.ts";

export default class Cookies {

    static parse(cookieheader:string) : any {
        var Cookies:any={};

        var splittet=cookieheader.split('; ');

        splittet.forEach((v)=>{
            var kvpstr = v.split('=');

            Cookies[kvpstr[0]]=kvpstr[1];
        })

        return Cookies;
    }
}