import { Note } from "../interfaces/NoteInterface";

export const fetchAPI = async (
  url: string,
  method: "POST" | "PUT",
  note: Note
): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: note.id,
        body: JSON.stringify(note),
      }),
    });

    if (!response.ok)
      throw new Error(
        `Failed to ${method === "POST" ? "save" : "update"} note`
      );

    return true;
  } catch (error) {
    console.error(
      `Error ${method === "POST" ? "saving" : "updating"} note:`,
      error
    );
    return false;
  }
};
