import { BaseDebugable } from "./BaseDebugable.ts";
import { getCurrentScriptname } from "./helper/path.ts";
import { FileData } from "./io/file.ts";
import { IComponent } from "./IComponent.ts";
import { RessourceCollection, Position } from "./io/ressource.ts";
import RequestData from "./RequestData.ts";
import PageCallAnswer from "./PageCallAnswer.ts";

export abstract class BasePage extends BaseDebugable {
    Components: Array<IComponent>;

    constructor() {
        super();
        this.Components = [];
        this.scriptname=getCurrentScriptname(import.meta.url);
    }

    headerWrapperAndResolver(
                                pagecontent: Promise<FileData>[],
                                headcontent: Promise<RessourceCollection|undefined>[],
                                csscontent: Promise<string>[]): Promise<PageCallAnswer> {
        return new Promise(async (resolve)=>{
            var header = await (await Promise.all(headcontent)).map((obj)=>(obj==undefined?"":obj.generateHTML(Position.Head))).join('');
            var body = await (await Promise.all(pagecontent)).map((obj)=>obj.content).join('');
            var bodyTopScripts = await (await Promise.all(headcontent)).map((obj)=>(obj==undefined?"":obj.generateHTML(Position.BodyTop))).join('');
            var bodyBottomScripts = await (await Promise.all(headcontent)).map((obj)=>(obj==undefined?"":obj.generateHTML(Position.BodyBottom))).join('');
            var css = await (await Promise.all(csscontent)).join('');

            var allHeaders = new Headers();
            var bodyHeaders = await (await Promise.all(pagecontent)).map((obj)=>obj.headers);
            bodyHeaders.forEach((headers)=>{
                for (let entry of headers) {
                    allHeaders.set(entry[0],entry[1]);
                }
            });

            resolve(new PageCallAnswer().setHeaders(allHeaders).setContent(`
                <html>
                    <head>${header}<style>${css}</style></head>
                    <body>${bodyTopScripts}${body}${bodyBottomScripts}</body>
                </html>
            `));
        });
    }

    build(args: RequestData): Promise<PageCallAnswer> {
        return new Promise((resolve, reject) => {
            var css = [];
            var body = [];
            var head = [];

            for (const key in this.Components) {
                if (this.Components.hasOwnProperty(key)) {
                    const el = this.Components[key];

                    body.push(el.body(args));
                    css.push(el.css(args));
                    head.push(el.ressources(args));
                }
            }

            this.headerWrapperAndResolver(body,head,css).then((res)=>{resolve(res);})
        })
    }
    css() {
        throw new Error("Method not implemented.");
    }

    async body(args: RequestData): Promise<PageCallAnswer> {
        return await this.build(args);
    }
    error(): string {
        throw new Error("Method not implemented.");
    }
    abstract matchingPathCheck(path: string) : boolean;
}