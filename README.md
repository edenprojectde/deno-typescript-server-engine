![CI](https://github.com/edenprojectde/deno-typescript-server-engine/workflows/CI/badge.svg)

# DTSE [Strongly WIP]

A fully OOM to handle Pages in Deno! With automatic parsing of GET & POST, autocreating a Session to store data in. Tested and Typed!

What you get into your Body and Components:

- [X] Session Objekt {with UUID, SessionStore}
- [X] GET and POST directly parsed as Switches and Data
- [X] Functions to load css from a file or add it in-code!
- [X] Load scripts external or internal, and 
- [ ] cache them if needed! (1/2 done)
- [ ] Premate Components to just copy in! [Blog Page, Google Login, Editor, ...]

## The Idea

We use Page-Objects (which have access rights, a route etc.) which can then load Components which have all the things available a site needs. (as listed above: Session, GET, POST, functions to load in files or let them be loaded dynamically)

Example:
```ts
class BlogPage implements BasePage {
  matchingPathCheck(path: string): boolean {
      return path.startsWith("/blog");
  }
  constructor() {
      super();

      this.Components = [
          new TopMenu(),
          new EditorComponent()
      ];

  }
}

export class EditorComponent extends BaseComponent {
    constructor() {
        super();
        this.scriptname = getCurrentScriptname(import.meta.url);
        this.path = getPathOnly(import.meta.url);
    }

    async body(args: RequestData): Promise<FileData> {
        return new Promise(async (resolve, reject) => {
            //var sessid = await args.session?.getID(); if you need the ID!

            resolve(new FileData().setContent(`
                <div class="editor-wrapper"><div id="editorjs"></div>
                <input id='refresh' type='button' value='REFRESH'></div>
                <test id='result'></test>
                <test id='resultHTML'></test>
                <test id='error'></test>`));
        });
    }

    ressources() : Promise<RessourceCollection> {
        return new Promise((resolve,reject)=>{
            // Load scripts!
            var RCol = new RessourceCollection()
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/header@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/quote@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/marker@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/warning@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/npm/@editorjs/table@latest","EditorJS"))
                .add(new Script("https://cdn.jsdelivr.net/gh/paraswaykole/editor-js-code@latest/dist/bundle.js","EditorJS"))
                .add(new Script("./main.js","EditorJS").setPosition(Position.BodyBottom))
                .add(new Link("https://fonts.googleapis.com/css2?family=Open+Sans&display=swap","stylesheet"))
            resolve(RCol);
        })
    }

    css() : Promise<string>{
        return new Promise( async (resolve,reject)=>{
            // Lädt CSS mit dem selben Dateinamen wie diesem.
            var fileCss = await this.loadFileCss();

            // Add CSS manually!
            fileCss+=".customCss {border:black solid 1px;}"

            resolve(fileCss);
        });
    }
}
```
