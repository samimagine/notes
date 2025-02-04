import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

interface FormattingToolbarProps {
  styles: Record<string, boolean | string>;
  onStyleChange: (styleKey: string, value: boolean | string) => void;
}

const FormattingToolbar = ({
  styles,
  onStyleChange,
}: FormattingToolbarProps) => {
  return (
    <div className="flex space-x-2 mb-2">
      <button onClick={() => onStyleChange("bold", !styles.bold)}>
        <FaBold />
      </button>
      <button onClick={() => onStyleChange("italic", !styles.italic)}>
        <FaItalic />
      </button>
      <button onClick={() => onStyleChange("underline", !styles.underline)}>
        <FaUnderline />
      </button>
      <button onClick={() => onStyleChange("alignment", "left")}>
        <FaAlignLeft />
      </button>
      <button onClick={() => onStyleChange("alignment", "center")}>
        <FaAlignCenter />
      </button>
      <button onClick={() => onStyleChange("alignment", "right")}>
        <FaAlignRight />
      </button>
    </div>
  );
};

export default FormattingToolbar;
