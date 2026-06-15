"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`px-2 py-1 text-xs rounded transition-colors select-none ${
        active
          ? "bg-emerald-100 text-emerald-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Write product description...",
      }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // Return empty string instead of empty paragraph tag
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[140px] px-4 py-3 text-sm text-gray-700 leading-relaxed focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  // Sync when switching between products in edit mode
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const tb = (fn: () => void, active: boolean, title: string, label: React.ReactNode) => (
    <ToolbarBtn onClick={fn} active={active} title={title}>
      {label}
    </ToolbarBtn>
  );

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-emerald-600 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        {tb(
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold"),
          "Bold",
          <strong>B</strong>
        )}
        {tb(
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic"),
          "Italic",
          <em>I</em>
        )}
        {tb(
          () => editor.chain().focus().toggleStrike().run(),
          editor.isActive("strike"),
          "Strikethrough",
          <s>S</s>
        )}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {tb(
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 }),
          "Heading 2",
          "H2"
        )}
        {tb(
          () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
          editor.isActive("heading", { level: 3 }),
          "Heading 3",
          "H3"
        )}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {tb(
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList"),
          "Bullet List",
          "• List"
        )}
        {tb(
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList"),
          "Numbered List",
          "1. List"
        )}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        {tb(
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote"),
          "Blockquote",
          "❝"
        )}
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          title="Undo"
        >
          ↩
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          title="Redo"
        >
          ↪
        </ToolbarBtn>
      </div>

      {/* Editor area */}
      <div className="bg-white">
        <style>{`
          .tiptap p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #9ca3af;
            pointer-events: none;
            height: 0;
          }
          .tiptap h2 { font-size: 1.1em; font-weight: 700; margin: 0.6em 0 0.3em; }
          .tiptap h3 { font-size: 1em; font-weight: 600; margin: 0.5em 0 0.2em; }
          .tiptap ul { list-style-type: disc; padding-left: 1.4em; margin: 0.4em 0; }
          .tiptap ol { list-style-type: decimal; padding-left: 1.4em; margin: 0.4em 0; }
          .tiptap li { margin: 0.15em 0; }
          .tiptap blockquote { border-left: 3px solid #d1fae5; padding-left: 0.8em; color: #6b7280; margin: 0.5em 0; }
          .tiptap p { margin: 0.25em 0; }
          .tiptap strong { font-weight: 600; }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
