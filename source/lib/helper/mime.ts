export class MimeChecker{
    db: Array<Mime> = [
        new Mime("js","application/javascript"),
        new Mime("ico","image/x-icon")
    ]

    getMime(path_or_filename:string) {
        var splitted = path_or_filename.split('.');

        return this.db.find((v:Mime)=>{
            return v.extension==splitted[splitted.length-1];
        })
    }
}

export class Mime {
    extension: string;
    mime: string;
    constructor(extension:string, mimestring:string){
        this.extension = extension;
        this.mime = mimestring;
    }
}