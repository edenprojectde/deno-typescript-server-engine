import Session from "./Session.ts";
import Cookies from "./Cookies.ts";
import Methods, { MethodData } from "./helper/method.ts";

export default class RequestData {
    url: string = "unknown";
    extra:string | undefined;
    session:Session | undefined;
    cookies: any | undefined;
    rawheaders: Headers;
    GET: MethodData | undefined;
    POST: MethodData | undefined;

    constructor(url: string, extra:string| undefined, session:Session| undefined, cookies:Cookies| undefined, postdata: MethodData | undefined, rawheaders: Headers) {
        this.url=url;
        this.extra=extra;
        this.session = session;
        this.cookies = cookies;
        this.rawheaders = rawheaders,
        this.GET = Methods.GET(url);
        this.POST = postdata;
    }
}