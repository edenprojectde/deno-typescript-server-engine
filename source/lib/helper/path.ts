export function getCurrentScriptname(metaurl:string): string {
    var splitet = metaurl.split("/")
    var last = splitet[splitet.length-1].split(".")[0];
    return last;
}
export function getFilename(metaurl:string): string {
    var splitet = metaurl.split("/")
    var last = splitet[splitet.length-1].split(".")[0];
    return last;
}
export function getFullPath(metaurl:string): string {
    var splitet = metaurl.split("/")
    var last = splitet[splitet.length-1].split(".")[0];
    return last.replace("file://","");;
}
export function getOtherFiletype(metaurl:string,extension:string): string {
    return metaurl.split(".")[0].replace("file://","")+extension;
}
export function getCurrentScriptnameWithoutExtension(metaurl:string): string {
    return metaurl.split(".")[0].replace("file://","");
}
export function getPathOnly(metaurl:string): string {
    var splitet = metaurl.split("/")
    return metaurl.replace("file://","").replace(splitet[splitet.length-1],'');
}