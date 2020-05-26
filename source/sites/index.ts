import { BasePage } from "../lib/BasePage.ts";
import { TopMenu } from "./components/topmenu.ts";
import { TestOutput } from "../lib/components/testoutput.ts";

export class Index extends BasePage {
    matchingPathCheck(path: string): boolean {
        return path=="/";
    }
    constructor() {
        super();

        this.Components = [
            new TopMenu(),
            new TestOutput("Index takes over!")
        ];
    }
    async css() {
        
    }
    error() : string {
        return import.meta.url;
    }
}