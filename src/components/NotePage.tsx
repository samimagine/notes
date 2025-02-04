import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Modal from "./common/Modal";
import UserInfo from "./UserInfo";
import useUsers from "../hooks/useUsers";
import { User } from "../interfaces/UserInterface";

const API_URL = "https://challenge.surfe.com/prendnotes/notes";

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  styles?: Record<string, string | boolean>;
}

const NotePage = () => {
  const { id } = useParams();
  const { findUserByUsername } = useUsers();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to load note");

        const data = await response.json();
        const noteData = JSON.parse(data.body);

        setNote({
          id: data.id,
          title: noteData.title ?? "Untitled",
          content: noteData.content,
          date: noteData.date,
          styles: noteData.styles,
        });
      } catch {
        setError("Error loading note.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleMentionClick = (username: string) => {
    const user = findUserByUsername(username);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const renderContentWithMentions = (content: string) => {
    return content.split(/(@\w+)/g).map((part, index) => {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-4">
      <h2 className="text-xl font-bold mb-2">{note?.title}</h2>
      <p className="text-sm text-gray-500">Last Updated: {note?.date}</p>
      <div className="mt-4 border p-4 rounded">
        {note?.content && renderContentWithMentions(note.content)}
      </div>

      <Link to="/" className="block mt-4 text-blue-500 hover:underline">
        Back to Canvas
      </Link>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedUser && <UserInfo user={selectedUser} />}
      </Modal>
    </div>
  );
};

export default NotePage;
