import { useState, useEffect, useRef } from "react";
import { fetchAPI } from "../utils/api";
import { Note } from "../interfaces/NoteInterface";

const API_URL = "https://challenge.surfe.com/prendnotes/notes";

const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);
  const canvasRef = useRef<HTMLFormElement>(null);
  const draggedNoteRef = useRef<Note | null>(null);

  useEffect(() => {
    loadNotes();
  }, [reloadFlag]);

  const loadNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch notes");

      const data = await response.json();
      const parsedNotes = data.map((note: { id: number; body: string }) => {
        try {
          const noteData = JSON.parse(note.body);
          return {
            id: note.id,
            x: noteData.x,
            y: noteData.y,
            title: noteData.title,
            date: noteData.date,
            content: noteData.content,
            deleted: noteData.deleted ?? false,
            styles: noteData.styles,
          };
        } catch {
          return {
            id: note.id,
            body: "Error parsing data",
            x: 0,
            y: 0,
            title: "",
            date: "",
            content: "",
            deleted: false,
            styles: {},
          };
        }
      });

      setNotes(parsedNotes.filter((note: Note) => !note.deleted));
    } catch {
      setMessage("Error loading notes.");
    }
  };

  const saveNote = async (note?: Note) => {
    const isNew = !note;
    let newNote = note;

    if (isNew) {
      const newId =
        notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;

      newNote = {
        id: newId,
        x: 100,
        y: 100,
        body: "",
        title: "Untitled",
        date: new Date()
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", " -"),
        content: "Double click to edit",
        deleted: false,
        styles: {},
      };
    } else {
      newNote = {
        ...note,
        date: new Date()
          .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", " -"),
      };
    }

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? API_URL : `${API_URL}/${newNote.id}`;

    const success = await fetchAPI(url, method, newNote);
    if (success) {
      setMessage(
        isNew ? "Note successfully created!" : "Note successfully saved!"
      );
      setReloadFlag((prev) => !prev);
    } else {
      setMessage(isNew ? "Error creating note." : "Error saving note.");
    }
    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  const deleteNote = async (note: Note) => {
    setDraggingId(null);
    draggedNoteRef.current = null;

    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== note.id));

    const success = await fetchAPI(`${API_URL}/${note.id}`, "PUT", {
      ...note,
      deleted: true,
    });

    if (!success) {
      setMessage("Error deleting note.");
      setReloadFlag((prev) => !prev);
    } else {
      setMessage("Note successfully deleted!");
    }

    setTimeout(() => {
      setMessage(null);
    }, 2000);
  };

  const updateNote = async (note: Note, shouldBeDeleted = false) => {
    const updatedNote = {
      ...note,
      deleted: shouldBeDeleted,
      date: new Date()
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", " -"),
    };

    const success = await fetchAPI(`${API_URL}/${note.id}`, "PUT", updatedNote);

    if (success) {
      setNotes((prevNotes) => [
        ...prevNotes.map((n) => (n.id === note.id ? updatedNote : n)),
      ]);

      setReloadFlag((prev) => !prev);
    } else {
      setMessage("Error updating note.");
    }
  };

  const handleMouseDown = (
    note: Note,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setDraggingId(note.id);
    draggedNoteRef.current = note;
    setOffset({
      x: clientX - note.x,
      y: clientY - note.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingId !== null) {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const newX = Math.min(
        Math.max(clientX - rect.left - offset.x, 0),
        rect.width - 100 // Ensures note stays inside
      );
      const newY = Math.min(
        Math.max(clientY - rect.top - offset.y, 0),
        rect.height - 100
      );

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggingId ? { ...note, x: newX, y: newY } : note
        )
      );

      if (draggedNoteRef.current) {
        draggedNoteRef.current.x = newX;
        draggedNoteRef.current.y = newY;
      }
    }
  };

  const handleMouseUp = () => {
    if (draggedNoteRef.current) {
      const updatedNote = notes.find(
        (note) => note.id === draggedNoteRef.current?.id
      );
      if (updatedNote) {
        saveNote(updatedNote);
      }
    }
    setDraggingId(null);
    draggedNoteRef.current = null;
  };

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyMessage("Copied to clipboard!");
      setTimeout(() => setCopyMessage(null), 2000);
    } catch {
      setCopyMessage("Failed to copy!");
    }
  };

  const handleTouchStart = (note: Note, e: React.TouchEvent) => {
    // ✅ Only call `preventDefault()` if the event is cancelable
    if (e.cancelable) e.preventDefault();

    setDraggingId(note.id);
    draggedNoteRef.current = note;

    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - note.x,
      y: touch.clientY - note.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggingId !== null) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const newX = touch.clientX - rect.left - offset.x;
      const newY = touch.clientY - rect.top - offset.y;

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggingId ? { ...note, x: newX, y: newY } : note
        )
      );

      if (draggedNoteRef.current) {
        draggedNoteRef.current.x = newX;
        draggedNoteRef.current.y = newY;
      }
    }
  };

  const handleTouchEnd = () => {
    if (draggedNoteRef.current) {
      const updatedNote = notes.find(
        (note) => note.id === draggedNoteRef.current?.id
      );
      if (updatedNote) {
        saveNote(updatedNote);
      }
    }

    setDraggingId(null);
    draggedNoteRef.current = null;
  };

  return {
    notes,
    message,
    copyMessage,
    saveNote,
    updateNote,
    deleteNote,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleCopyToClipboard,
    setNotes,
    canvasRef,
  };
};

export default useNotes;
