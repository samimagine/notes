import { useState, useEffect } from "react";

interface CardHeaderProps {
  title: string;
  onUpdate: (newTitle: string) => void;
}

const CardHeader = ({ title, onUpdate }: CardHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedTitle !== title) {
      onUpdate(editedTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onUpdate(editedTitle);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  return isEditing ? (
    <input
      className="w-full text-lg font-bold border-b p-1 focus:outline-none"
      value={editedTitle}
      onChange={handleTitleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <h2
      className="text-lg font-bold mb-1 cursor-pointer"
      onDoubleClick={() => setIsEditing(true)}
    >
      {editedTitle}
    </h2>
  );
};

export default CardHeader;
