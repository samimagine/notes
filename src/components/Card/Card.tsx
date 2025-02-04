import useNotes from "../../hooks/useNotes";
import useDebounce from "../../hooks/useDebounce";
import CardHeader from "./CardHeader";
import CardContent from "./CardContent";
import CardActions from "./CardActions";

interface CardProps {
  id: number;
  title: string;
  lastUpdate: string;
  content: string;
  styles?: Record<string, boolean | string>;
  onDelete: () => void;
  onUpdate: (newTitle: string, newContent: string) => void;
  editNote: () => void;
}

const Card = ({
  id,
  title,
  lastUpdate,
  content,
  styles = {},
  onDelete,
  onUpdate,
  editNote,
}: CardProps) => {
  const { handleCopyToClipboard, copyMessage } = useNotes();
  const debounceSave = useDebounce(
    (updatedTitle: string, updatedContent: string) => {
      onUpdate(updatedTitle, updatedContent);
    }
  );

  return (
    <div
      key={id}
      className="bg-white shadow-md rounded-lg p-4 w-80 min-h-[160px] border relative cursor-pointer"
    >
      <CardHeader
        title={title}
        onUpdate={(newTitle) => debounceSave(newTitle, content)}
      />
      <p className="text-xs text-gray-500 mb-2">Last updated: {lastUpdate}</p>
      <CardContent
        content={content}
        styles={styles}
        onUpdate={(newContent) => debounceSave(title, newContent)}
      />
      <CardActions
        onEdit={editNote}
        onCopy={() => handleCopyToClipboard(content)}
        onDelete={onDelete}
      />

      {copyMessage && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-3 rounded">
          {copyMessage}
        </div>
      )}
    </div>
  );
};

export default Card;
