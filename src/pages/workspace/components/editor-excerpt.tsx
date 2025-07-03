import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

const EditorExcerpt = () => {
  const [, setExcerptContent] = useState("");
  const excerptEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Write a short description...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-gray max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setExcerptContent(editor.getText());
    },
  });
  return (
    <div className="relative">
      <EditorContent editor={excerptEditor} className="excerpt-editor" />
    </div>
  );
};

export default EditorExcerpt;
