"use strict";

(function () {
  var editor = new EditorJS({
    holder: 'editorjs',
    tools: {
      header: Header,
      quote: Quote,
      warning: Warning,
      code: CodeTool,
      marker: Marker,
      table: {
        "class": Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3
        }
      },
      checklist: Checklist
    }
  });

  function parseEditorJS(obj) {
    var parsed = "<div class='blog-wrapper'>";
    if (!obj || !obj.blocks) return "EMPTY";
    obj.blocks.forEach(function (e) {
      switch (e['type']) {
        case "paragraph":
          parsed += "<p>" + e.data.text + "</p>";
          break;

        case "warning":
          parsed += "<div class='warning'>\n                                <div class='warning-head'>".concat(e.data.title, "</div>\n                                <div class='warning-body'>").concat(e.data.message, "</div>\n                            </div>");
          break;

        case "quote":
          parsed += "<quote>".concat(e.data.text, "</quote><caption>").concat(e.data.caption, "</caption>");
          break;

        case "header":
          parsed += "<h".concat(e.data.level, ">").concat(e.data.text, "</h").concat(e.data.level, ">");
          break;

        default:
          break;
      }
    });
    return parsed + "</div>";
  }

  document.getElementById("refresh").addEventListener('click', function () {
    editor.save().then(function (outputData) {
      document.getElementById('result').innerText = JSON.stringify(outputData);
      document.getElementById('resultHTML').innerHTML = parseEditorJS(outputData);
    })["catch"](function (error) {
      document.getElementById('debug').innerText = JSON.stringify(error);
    });
  });
})();