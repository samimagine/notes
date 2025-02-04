import { useState, useEffect } from "react";
import useUsers from "../../hooks/useUsers";
import Modal from "../common/Modal";
import UserInfo from "../UserInfo";
import { User } from "../../interfaces/UserInterface";

interface CardContentProps {
  content: string;
  styles?: Record<string, boolean | string>;
  onUpdate: (newContent: string) => void;
}

const CardContent = ({ content, styles = {}, onUpdate }: CardContentProps) => {
  const { findUserByUsername } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedContent !== content) {
      onUpdate(editedContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditedContent(content);
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      onUpdate(editedContent);
    }
  };

  const handleMentionClick = (username: string) => {
    const user = findUserByUsername(username);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const renderContentWithMentions = (text: string) => {
    return text.split(/(@\w+)/g).map((part, index) => {
      if (part.startsWith("@")) {
        return (
          <span
            key={index}
            className="text-blue-500 cursor-pointer"
            onClick={() => handleMentionClick(part.substring(1))}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <>
      {isEditing ? (
        <textarea
          className="w-full h-20 border p-2 text-sm"
          value={editedContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div
          className="text-sm text-gray-700 mb-4 cursor-pointer"
          onDoubleClick={() => setIsEditing(true)}
          style={{
            textAlign: styles.alignment as
              | "left"
              | "right"
              | "center"
              | "justify",
          }}
        >
          <span
            style={{
              fontWeight: styles.bold ? "bold" : "normal",
              fontStyle: styles.italic ? "italic" : "normal",
              textDecoration: styles.underline ? "underline" : "none",
            }}
          >
            {renderContentWithMentions(content)}
          </span>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedUser && <UserInfo user={selectedUser} />}
      </Modal>
    </>
  );
};

export default CardContent;
