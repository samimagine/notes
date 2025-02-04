import { useState, useRef } from "react";
import FormattingToolbar from "./FormattingToolbar";
import MentionsDropdown from "./MentionsDropDown";
import useMentions from "../../hooks/useMentions";
import useDebounce from "../../hooks/useDebounce";

interface CardEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialStyles?: Record<string, string | boolean>;
  onSave: (
    title: string,
    content: string,
    styles: Record<string, boolean | string>
  ) => void;
  onClose: () => void;
}

const CardEditor = ({
  initialTitle,
  initialContent,
  initialStyles,
  onSave,
  onClose,
}: CardEditorProps) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent || "");
  const [styles, setStyles] = useState<Record<string, boolean | string>>({
    bold: false,
    italic: false,
    underline: false,
    alignment: "left",
    ...(initialStyles || {}),
  });
  const [status, setStatus] = useState("saved");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    mentionResults,
    handleMentions,
    handleMentionSelect,
    handleKeyDown,
    selectedIndex,
  } = useMentions();

  const debounceSave = useDebounce(() => {
    setStatus("saving...");
    onSave(title, content, styles);
    setStatus("saved");
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debounceSave();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    handleMentions(newContent);
    debounceSave();
  };

  const handleBlur = () => {
    onSave(title, content, styles);
  };

  const handleStyleChange = (styleKey: string, value: boolean | string) => {
    setStyles((prev) => {
      const newStyles = { ...prev, [styleKey]: value };
      debounceSave();
      return newStyles;
    });
  };

  const handleMentionClick = (username: string) => {
    if (!textareaRef.current) return;
    const cursorPos = textareaRef.current.selectionStart;

    handleMentionSelect(username, setContent, cursorPos, onSave, title, styles);

    debounceSave();
  };

  return (
    <div>
      <input
        type="text"
        className="w-full text-lg font-bold border-b p-1 focus:outline-none mb-2"
        value={title}
        onBlur={handleBlur}
        onChange={handleTitleChange}
        placeholder="Enter title..."
      />

      <FormattingToolbar styles={styles} onStyleChange={handleStyleChange} />

      <textarea
        ref={textareaRef}
        className={`w-full h-40 border p-2${styles.bold ? " font-bold" : ""}${
          styles.italic ? " italic" : ""
        }${styles.underline ? " underline" : ""}`}
        style={{
          textAlign: styles.alignment as
            | "left"
            | "center"
            | "right"
            | "justify",
        }}
        value={content}
        onBlur={handleBlur}
        onChange={handleContentChange}
        onKeyDown={(e) =>
          handleKeyDown(
            e,
            setContent,
            textareaRef.current?.selectionStart || 0,
            onSave,
            title,
            styles,
            onClose,
            content
          )
        }
      />

      {mentionResults.length > 0 && (
        <MentionsDropdown
          mentionResults={mentionResults}
          selectedIndex={selectedIndex}
          onSelect={handleMentionClick}
        />
      )}

      <div className="mt-2 text-blue-500 text-sm animate-pulse">{status}</div>
    </div>
  );
};

export { CardEditor };
