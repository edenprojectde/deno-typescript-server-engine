export class Script implements IRessource, IRessourceDescription{
    private Src: string;
    private Module:boolean = false;
    private Defer:boolean = false;
    private Async:boolean = false;
    private LibaryName: string;
    private Position:Position=Position.Head;


	constructor(src: string, libname:string) {
        this.Src=src;
        this.LibaryName = libname;
    }
	
    getHTML(): string{
        return `<script src="${this.Src}" ${this.Module?'type="module"':''} ${this.Defer?'defer':''} ${this.Async?'async':''}></script>`;
    }
    getPosition() : Position {
        return this.Position;
    }

    setPosition(position:Position) : Script{
        this.Position = position;
        return this
    }
    setIsModule() : Script{
        this.Module = true;
        return this
    }

    setIsAsync() : Script{
        this.Module = true;
        return this
    }
    setIsDefer() : Script{
        this.Module = true;
        return this
    }
    getDescription(): string {
        return this.LibaryName;
    }
}
export class InlineScript implements IRessource,IRessourceDescription {
    private Content: string;
    private LibaryName: string;
    private Position:Position=Position.Head;


	constructor(content: string, libname:string) {
        this.Content=content;
        this.LibaryName = libname;
    }
    getDescription(): string {
        return this.LibaryName;
    }
	
    getHTML(): string{
        return `<script>${this.Content}</script>`;
    }
    getPosition() : Position {
        return this.Position;
    }
    setPosition(position:Position) : InlineScript{
        this.Position = position;
        return this;
    }
}
export class Meta {
    private Position:Position=Position.Head;
    private Content: string;
    private Name: string;

    constructor(name: string, content: string) {
        this.Name=name;
        this.Content = content;
    }

    getHTML(): string{
        return `<meta name="${this.Name}" content="${this.Content}" ></script>`;
    }
    getPosition() : Position {
        return this.Position;
    }

    setPosition(position:Position) : Script{
        throw new Error("Position can not be set on Meta Ressources!");
    }
}
export class Link implements IRessource{
    private Position:Position=Position.Head;
    private Rel: string;
    private Href: string;

    constructor(href: string, rel: string) {
        this.Href=href;
        this.Rel = rel;
    }

    getHTML(): string{
        return `<link href="${this.Href}" rel="${this.Rel}" >`;
    }
    getPosition() : Position {
        return this.Position;
    }
    setPosition(position:Position) : Script{
        throw new Error("Position can not be set on Link Ressources!");
    }
}
export class Style {}

export class RessourceCollection {
    private Ressources: Array<IRessource> = [];

    add(ressource: IRessource): RessourceCollection {
        this.Ressources.push(ressource);
        return this;
    }

    generateHTML(position:Position) : string {
        var retval = "";
        this.Ressources.filter((v)=>v.getPosition()==position).forEach((v)=>{
            retval+=v.getHTML();
        });
        return retval;
    }

    /**
     * Get the names of all Ressource files registred.
     */
    getDescriptedRessources() : string[] {
        var ressources = this.Ressources as Array<any>;
        ressources
            .filter((v)=>v.getDescription!=undefined)
            .map((v)=>{
                return v.getDescription();
            });
        return ressources;
    }
}

export enum Position {
    Head = 1,
    BodyBottom,
    BodyTop
}

export interface IRessource {
    getHTML():string;
    getPosition():Position;
    setPosition(position:Position): IRessource;
}
export interface IRessourceDescription {
    getDescription(): string;
}