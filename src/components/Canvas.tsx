import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "./Card/Card";
import Modal from "./common/Modal";
import { CardEditor } from "./CardEditor/CardEditor";
import useNotes from "../hooks/useNotes";
import { Note } from "../interfaces/NoteInterface";

const Canvas = () => {
  const {
    notes,
    message,
    saveNote,
    updateNote,
    deleteNote,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setNotes,
    canvasRef,
  } = useNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleSave = (
    newTitle: string,
    newContent: string,
    styles: Record<string, boolean | string>
  ) => {
    if (!editingNote) return;

    const updatedNote = {
      ...editingNote,
      title: newTitle,
      content: newContent,
      styles,
    };

    setNotes((prevNotes) => [
      ...prevNotes.map((note) =>
        note.id === editingNote.id ? updatedNote : note
      ),
    ]);

    setEditingNote(updatedNote);
    updateNote(updatedNote);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <form
      ref={canvasRef}
      className="w-[100vw] h-[100vh] bg-gray-100 relative overflow-auto touch-none origin-top-left"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onSubmit={(e) => e.preventDefault()}
    >
      {message && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-2 rounded">
          {message}
        </div>
      )}

      <button
        type="button"
        className="sticky top-4 left-4 bg-blue-500 text-white p-2 rounded z-50"
        onClick={() => saveNote()}
      >
        Add Note
      </button>

      {notes.map((note) => (
        <div
          key={note.id}
          className="absolute cursor-move"
          style={{ left: note.x, top: note.y }}
          onMouseDown={(e) => handleMouseDown(note, e)}
          onTouchStart={(e) => handleTouchStart(note, e)}
        >
          <Card
            id={note.id}
            title={note.title}
            lastUpdate={note.date}
            content={note.content}
            styles={note.styles}
            onDelete={() => deleteNote(note)}
            onUpdate={(newTitle, newContent) =>
              updateNote({ ...note, title: newTitle, content: newContent })
            }
            editNote={() => {
              setEditingNote(note);
              setIsModalOpen(true);
            }}
          />
          <Link
            to={`/note/${note.id}`}
            className="block mt-2 text-blue-500 hover:underline"
          >
            View Note
          </Link>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {editingNote && (
          <CardEditor
            initialTitle={editingNote.title}
            initialContent={editingNote.content}
            initialStyles={editingNote.styles}
            onSave={handleSave}
            onClose={closeModal}
          />
        )}
      </Modal>
    </form>
  );
};

export default Canvas;
