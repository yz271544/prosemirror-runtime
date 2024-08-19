import test from 'ava';
import { EditorState } from 'prosemirror-state';
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { schema as marksSchema } from 'prosemirror-schema-mark';
import { exampleSetup } from 'prosemirror-example-setup';

// 定义一个基础的 ProseMirror schema
const schema = new Schema({
    nodes: basicSchema.spec.nodes,
    marks: marksSchema.spec.marks,
});

test('ProseMirror simple code test', t => {
    // 创建一个空的编辑器文档
    const doc = DOMParser.fromSchema(schema).parse(document.createElement('div'));
    const state = EditorState.create({
        doc,
        plugins: exampleSetup({ schema }),
    });

    // 创建 EditorView 实例
    const editorView = new EditorView(document.createElement('div'), {
        state,
    });

    // 初始内容
    const initialContent = '<p>Hello, <strong>ProseMirror</strong>!</p>';
    const dom = document.createElement('div');
    dom.innerHTML = initialContent;

    // 更新编辑器的内容
    const newDoc = DOMParser.fromSchema(schema).parse(dom);
    editorView.updateState(
        editorView.state.apply(
            editorView.state.tr.replaceWith(0, editorView.state.doc.content.size, newDoc.content)
        )
    );

    // 验证内容是否正确
    const output = DOMSerializer.fromSchema(schema).serializeFragment(editorView.state.doc.content);
    const outputContainer = document.createElement('div');
    outputContainer.appendChild(output);

    // 使用 AVA 的断言来验证结果
    t.is(outputContainer.innerHTML, initialContent);

    // 销毁 EditorView 实例以清理资源
    editorView.destroy();
});