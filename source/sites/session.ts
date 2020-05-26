import { BasePage } from "../lib/BasePage.ts";
import { TopMenu } from "./components/topmenu.ts";
import { SessionComponent } from "./components/session.ts";

export class SessionPage extends BasePage {

    

    matchingPathCheck(path: string): boolean {
        return path.startsWith("/session");
    }
    constructor() {
        super();
        
        this.Components = [
            new TopMenu(),
            new SessionComponent()
        ];

    }
}