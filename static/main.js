(()=>{
    var editor = new EditorJS({
        holder : 'editorjs',
        tools: {
            header: Header,
            quote: Quote,
            warning: Warning,
            code: CodeTool,
            marker: Marker,
            table: {
                class:Table,
                inlineToolbar: true,
                    config: {
                        rows: 2,
                        cols: 3,
                    }
            },
            checklist: Checklist,
        }
    });
    
    function parseEditorJS(obj){
        var parsed = "<div class='blog-wrapper'>";
        if(!obj || !obj.blocks) return "EMPTY";
        obj.blocks.forEach(e => {
            switch(e['type']) {
                case "paragraph":
                    parsed+="<p>"+e.data.text+"</p>";
                    break;
                case "warning":
                    parsed+=`<div class='warning'>
                                <div class='warning-head'>${e.data.title}</div>
                                <div class='warning-body'>${e.data.message}</div>
                            </div>`;
                    break;
                case "quote":
                    parsed+=`<quote>${e.data.text}</quote><caption>${e.data.caption}</caption>`;
                    break;
                case "header":
                    parsed+=`<h${e.data.level}>${e.data.text}</h${e.data.level}>`;
                    break;
                default:
                    break;
            }
        });
        return parsed+"</div>";
    }

    document.getElementById("refresh").addEventListener('click',()=>{
        editor.save().then((outputData) => {
            document.getElementById('result').innerText = JSON.stringify(outputData);
            
            document.getElementById('resultHTML').innerHTML = parseEditorJS(outputData);
          }).catch((error) => {
            document.getElementById('debug').innerText = JSON.stringify(error);
          });
    })
    

    
})()
