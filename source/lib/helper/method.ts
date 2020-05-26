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
    static GET(path: string): MethodData | undefined {
        if(path.indexOf('?')===-1) return undefined;

        var pairs = path.split('?')[1].split('&');
        var parisKVP : MethodData = new MethodData();

        pairs.forEach((v)=>{
            if(v.indexOf('=')===-1) {parisKVP.Switches.push(v)}
            else {
                var kvpvals:Array<string> = v.split('='); 
                parisKVP.Data[kvpvals[0]]=kvpvals[1];
            }
        });
    }
    static POST(data: string, type : string | POSTHeaders | null): MethodData | undefined {
        var postdata: MethodData = new MethodData();
        
        if(type == POSTHeaders.HtmlFormular)
            data.split('&')
                .map(v=>v.split('='))
                .forEach(v=>{ postdata.Data[unescape(v[0])] = unescape(v[1])})

        return postdata;
    }
}

export class MethodData {
    Switches: Array<string> = [];
    Data: any;
}
export enum POSTHeaders {
    HtmlFormular= "application/x-www-form-urlencoded"
}