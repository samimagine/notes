import { useState, useEffect } from "react";

const API_USERS_URL = "https://challenge.surfe.com/users";

interface User {
  username: string;
}

const useMentions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [mentionResults, setMentionResults] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_USERS_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        if (isMounted) setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMentions = (text: string) => {
    const mentionMatch = text.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();

      if (query === "") {
        const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
        setMentionResults(shuffledUsers.slice(0, 5));
      } else {
        const filteredUsers = users
          .filter((user) => user.username.toLowerCase().includes(query))
          .slice(0, 5);
        setMentionResults(filteredUsers);
      }

      setSelectedIndex(-1);
    } else {
      setMentionResults([]);
      setSelectedIndex(-1);
    }
  };

  const handleMentionSelect = (
    username: string,
    setContent: (value: string | ((prev: string) => string)) => void,
    cursorPos: number,
    onSave: (
      title: string,
      content: string,
      styles: Record<string, boolean | string>
    ) => void,
    title: string,
    styles: Record<string, boolean | string>
  ) => {
    setContent((prevContent) => {
      const updatedContent = insertMention(prevContent, username, cursorPos);

      // ✅ Save after updating content
      setTimeout(() => {
        onSave(title, updatedContent, styles);
        setMentionResults([]);
        setSelectedIndex(-1);
      }, 0);

      return updatedContent;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    setContent: (value: string | ((prev: string) => string)) => void,
    cursorPos: number,
    onSave: (
      title: string,
      content: string,
      styles: Record<string, boolean | string>
    ) => void,
    title: string,
    styles: Record<string, boolean | string>,
    onClose: () => void,
    content: string
  ) => {
    if (mentionResults.length === 0) {
      if (e.key === "Escape") {
        e.preventDefault();
        onSave(title, content, styles);
        onClose();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < mentionResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : mentionResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleMentionSelect(
          mentionResults[selectedIndex].username,
          setContent,
          cursorPos,
          onSave,
          title,
          styles
        );
      }
    } else if (e.key === "Escape") {
      e.preventDefault();

      if (selectedIndex >= 0) {
        handleMentionSelect(
          mentionResults[selectedIndex].username,
          setContent,
          cursorPos,
          onSave,
          title,
          styles
        );
      }

      setTimeout(() => {
        onSave(title, content, styles);
        setMentionResults([]);
        setSelectedIndex(-1);
        onClose();
      }, 0);
    }
  };

  const insertMention = (
    text: string,
    username: string,
    cursorPos: number
  ): string => {
    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    const mentionStart = beforeCursor.lastIndexOf("@");
    if (mentionStart === -1) return text;

    return beforeCursor.slice(0, mentionStart) + `@${username} ` + afterCursor;
  };

  return {
    mentionResults,
    insertMention,
    handleMentions,
    handleMentionSelect,
    handleKeyDown,
    selectedIndex,
    setMentionResults,
    setSelectedIndex,
  };
};

export default useMentions;
