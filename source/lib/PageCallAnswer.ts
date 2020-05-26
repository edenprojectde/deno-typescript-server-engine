export default class PageCallAnswer {
    content: string = "";
    header: Headers = new Headers();

    setContent(text:string) {
        this.content=text;
        return this;
    }
    addHeader(name:string, value:string) {
        this.header.set(name,value);
        return this;
    }
    setHeaders(headers:Headers) {
        this.header = headers
        return this;
    }
}