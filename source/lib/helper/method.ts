import { KVP } from "../datatypes/kvp.ts" // Custom Key Value Pair

export default class Methods {
    // Input ex. 
    // /site?make=1&site=123&userpage=222  
    //      ==> GETData Object { 
    //                              Data:{
    //                                        "make",:          "1",
    //                                        "site",:          "123",
    //                                        "userpage":       "222" }
    //                              Switches: []
    //                          }
    // /sites/userpage?123                 ==>
    //      ==> GETData Object { 
    //                              Data:[]
    //                              Switches: ["123"]
    //                          }
    static GET(path: string): GETData | undefined {
        if(path.indexOf('?')===-1) return undefined;

        var pairs = path.split('?')[1].split('&');
        var parisKVP : GETData = new GETData();

        pairs.forEach((v)=>{
            if(v.indexOf('=')===-1) {parisKVP.Switches.push(v)}
            else {
                var kvpvals:Array<string> = v.split('='); 
                parisKVP.Data[kvpvals[0]]=kvpvals[1];
            }
        });
    }
}

export class GETData {
    Switches: Array<string> = [];
    Data: any;
}