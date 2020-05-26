import { MimeChecker } from "../helper/mime.ts";

export class FileData {
    filename: string | undefined
    content: string = ""
    headers: Headers = new Headers();

    get mime() : string | undefined {
        if(this.filename == undefined) return undefined;
        return new MimeChecker().getMime(this.filename)?.mime;
    }

    setContent(content: string) {
        this.content = content;
        return this;
    }
    setFilename(filename: string) {
        this.filename = filename;
        return this;
    }
}