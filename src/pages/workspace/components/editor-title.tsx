import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { useWorkspace } from "../use-workspace";

const EditorTitle = () => {
  const { updateArticle, contentArticle } = useWorkspace();
  const updateTimeoutRef = useRef(null as NodeJS.Timeout | null);

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
    content: `<h1>${contentArticle?.title || ""}</h1>`,
    onUpdate: ({ editor }) => {
      const newTitle = editor.getText();

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        if (contentArticle && newTitle !== contentArticle.title) {
          updateArticle({ title: newTitle });
        }
      }, 2000);
    },
  });

  useEffect(() => {
    titleEditor?.commands.setContent(`<h1>${contentArticle?.title || ""}</h1>`);
  }, [contentArticle?.title, titleEditor]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <EditorContent editor={titleEditor} className="title-editor" />
    </div>
  );
};

export default EditorTitle;
