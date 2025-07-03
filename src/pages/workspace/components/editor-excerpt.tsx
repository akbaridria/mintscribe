import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { useWorkspace } from "../use-workspace";

const EditorExcerpt = () => {
  const { updateArticle, contentArticle } = useWorkspace();
  const updateTimeoutRef = useRef(null as NodeJS.Timeout | null);

  const defaultContent = contentArticle?.excerpt
    ? `<p>${contentArticle.excerpt}</p>`
    : "<p></p>";

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
    content: defaultContent,
    editorProps: {
      attributes: {
        class: "prose prose-gray max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const newExcerpt = editor.getText();

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        if (contentArticle && newExcerpt !== contentArticle.excerpt) {
          updateArticle({ excerpt: newExcerpt });
        }
      }, 2000);
    },
  });

  useEffect(() => {
    excerptEditor?.commands.setContent(`<p>${contentArticle?.excerpt || ''}</p>`);
  }, [contentArticle?.excerpt, excerptEditor]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <EditorContent editor={excerptEditor} className="excerpt-editor" />
    </div>
  );
};

export default EditorExcerpt;
