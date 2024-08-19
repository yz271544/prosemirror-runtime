import puppeteer from 'puppeteer'

async function runProseMirrorCode() {
    // 启动 Puppeteer 浏览器实例
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // 在页面中注入 ProseMirror 编辑器的基本 HTML 结构和 JS 代码
    await page.setContent(`
        <html>
          <body>
            <div id="editor"></div>
            <script src="https://unpkg.com/prosemirror-model"></script>
            <script src="https://unpkg.com/prosemirror-state"></script>
            <script src="https://unpkg.com/prosemirror-view"></script>
          </body>
        </html>
      `)

    // Puppeteer 运行中的 ProseMirror 代码
    const codeStr = `
    // 初始化 ProseMirror 编辑器
    const {EditorState, Transaction} = window['prosemirror-state'];
    const {EditorView, DOMParser} = window['prosemirror-view'];
    const {Schema, DOMSerializer, Node} = window['prosemirror-model'];

    // 定义 ProseMirror 的 schema
    const schema = new Schema({
      nodes: {
        text: {},
        doc: { content: 'text*' },
        paragraph: { content: 'text*', group: 'block' },
        bold: { inline: true, group: 'inline', parseDOM: [{tag: 'strong'}], toDOM: () => ['strong', 0] },
      },
      marks: {
        bold: {}
      }
    });

    const doc = schema.node('doc', null, [schema.node('paragraph', null, [schema.text('')])]);
    const editor = {
      state: EditorState.create({doc}),
      view: new EditorView(document.querySelector('#editor'), {
        state: EditorState.create({
          doc,
          schema
        }),
        dispatchTransaction(transaction) {
          console.log('Document size:', transaction.doc.content.size);
          this.updateState(this.state.apply(transaction));
        }
      })
    };

    let tr = editor.state.tr.insertText('测试测试测试', 0);
    const mark = editor.state.schema.marks.bold.create();
    tr = tr.addMark(0, 5, mark);
    editor.view.dispatch(tr);

    // 获取并返回编辑后的 HTML 内容
    return editor.view.dom.innerHTML;
  `

    const result = await page.evaluate(codeStr)
    console.log('Edited Content:', result)

    await browser.close()
}

runProseMirrorCode()
