import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

const EditorTitle = () => {
  const [, setTitleContent] = useState("");
  const titleEditor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1],
        },
        paragraph: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Title",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: "<h1></h1>",
    onUpdate: ({ editor }) => {
      setTitleContent(editor.getText());
    },
  });
  return (
    <div className="relative">
      <EditorContent
        editor={titleEditor}
        className="title-editor"
      />
    </div>
  );
};

export default EditorTitle;
