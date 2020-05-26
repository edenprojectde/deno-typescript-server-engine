import { BasePage } from "../lib/BasePage.ts";
import { TopMenu } from "./components/topmenu.ts";
import { TestOutput } from "../lib/components/testoutput.ts";
import { BlogPost } from "./components/blogpost.ts";


export class BlogPage extends BasePage {

    matchingPathCheck(path: string): boolean {
        return path.startsWith("/blog");
    }
    constructor() {
        super();

        this.Components = [
            new TopMenu(),
            new BlogPost()
        ];
        
    }
    error() : string {
        return import.meta.url;
    }
}