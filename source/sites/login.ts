import { BasePage } from "../lib/BasePage.ts";
import { TopMenu } from "./components/topmenu.ts";
import { TestOutput } from "../lib/components/testoutput.ts";
import { GoogleloginComponent } from "./components/googlelogin.ts";

export class LoginPage extends BasePage {
    matchingPathCheck(path: string): boolean {
        return path=="/login";
    }
    constructor() {
        super();

        this.Components = [
            new TopMenu(),
            new TestOutput("Login takes over!"),
            new GoogleloginComponent()
        ];
    }
    error() : string {
        return import.meta.url;
    }
}