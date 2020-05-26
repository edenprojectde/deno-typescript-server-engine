// <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>

import { BasePage } from "../lib/BasePage.ts";
import { TopMenu } from "./components/topmenu.ts";
import { EditorComponent } from "./components/editor.ts";
import { FormtestComponent } from "./components/formtest.ts";


export class EditorPage extends BasePage {
    matchingPathCheck(path: string): boolean {
        return path=="/editor";
    }
    constructor() {
        super();

        this.Components = [
            new TopMenu(),
            new EditorComponent(),
            new FormtestComponent()
        ];
    }
    error() : string {
        return import.meta.url;
    }
}