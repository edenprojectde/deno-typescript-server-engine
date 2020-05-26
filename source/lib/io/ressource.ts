export class Script implements IRessource{
    Src: string;
    Module:boolean = false;
    LibaryName: string;
    Position:Position=Position.Head;


	constructor(Src: string, LibaryName:string) {
        this.Src=Src;
        this.LibaryName = LibaryName;
    }
	
    getHTML(): string{
        return `<script src=${this.Src} ${this.Module?'type="module"':''}></script>`;
    }

    setPosition(position:Position) : Script{
        this.Position = position;
        return this
    }
    setModule() : Script{
        this.Module = true;
        return this
    }
}
export class Meta {

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
        this.Ressources.filter((v)=>v.Position==position).forEach((v)=>{
            retval+=v.getHTML();
        });
        return retval;
    }
}

export enum Position {
    Head = 1,
    BodyBottom,
    BodyTop
}

export interface IRessource {
    getHTML():string;
    Position:Position
}