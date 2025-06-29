import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { useEffect } from "react";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  onEditorReady?: (editor: Editor) => void;
  onUpdate?: () => void;
}

const defaultContent = `
  <h1>Welcome to Your Article</h1>
  <p>Start writing your documentation here. You can use all the rich text features available in the toolbar above.</p>
  
  <h2>Features</h2>
  <ul>
    <li>Rich text editing with Tiptap</li>
    <li>Beautiful UI with shadcn/ui components</li>
    <li>GitBook-like experience</li>
    <li>Code syntax highlighting</li>
    <li>Image support</li>
    <li>And much more!</li>
  </ul>
  
  <h3>Code Example</h3>
  <pre><code class="language-javascript">function hello() {
  console.log("Hello, World!");
}</code></pre>
  
  <blockquote>
    <p>This is a beautiful quote block that you can use to highlight important information.</p>
  </blockquote>
`;

export function TiptapEditor({ onEditorReady, onUpdate }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "Start writing your article...",
        emptyEditorClass: "is-editor-empty",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline underline-offset-2 hover:text-primary/80",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto",
        },
      }),
    ],
    content: defaultContent,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: () => {
      if (onUpdate) {
        onUpdate();
      }
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return (
    <div className="w-full">
      <EditorContent editor={editor} />
    </div>
  );
}
