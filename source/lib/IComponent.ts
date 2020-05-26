import { FileData } from "./io/file.ts";
import { IRessource, RessourceCollection } from "./io/ressource.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import RequestData from "./RequestData.ts";

export interface IComponent {
    body(args: undefined | RequestData): Promise<FileData>,
    css(args: undefined | RequestData): Promise<string>,
    ressources(args: undefined | RequestData): Promise<RessourceCollection | undefined>
    uuid: string,
    error(): string
}