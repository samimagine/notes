# 📝 Note-Taking App

A **React + TypeScript** note-taking application built with **Vite**. This app allows users to create, edit, and manage notes with **rich text formatting**, **mentions**, and **keyboard navigation**. It also supports **individual note sharing** via unique routes.

---

## 🚀 Features

✔ **Fast & Responsive** – Built with modern React best practices.  
✔ **Mentions (@username)** – Suggest users and display user info in a popup.  
✔ **Keyboard Navigation** – Navigate mentions with `Arrow Up` / `Arrow Down`, select with `Enter`.  
✔ **Text Formatting** – Bold, Italic, Underline, and Text Alignment.  
✔ **Quick Edits** – Edit both title and content directly from the canvas.  
✔ **Copy Content** – Click a button to copy the note’s content.  
✔ **Delete Notes** – Remove notes with a single click.  
✔ **Standalone Note Routes** – Each note has its own URL for easy sharing.  
✔ **Full Editor Mode** – Open a dedicated editor for more advanced formatting.

---

## 📡 APIs Used

The app interacts with the following APIs:

- **Notes API** (`https://challenge.surfe.com/prendnotes/notes`)  
  Handles fetching, creating, updating, and deleting notes.

- **Users API** (`https://challenge.surfe.com/users`)  
  Provides user data for the mention system (`@username`).

---

## 💻 Installation & Running the App

📦 **1. Install dependencies:**  
`npm install`

🚀 **2. Start the development server:**  
`npm run dev`

🌍 **3. Open the app in your browser:**  
`http://localhost:5173`

---

## 🚀 Usage

✅ **Create a note** – Click the **Add Note** button to create a new note.

✏ **Edit on the fly** – Double-click a **note title** or **content** to edit inline.

📝 **Open full editor** – Click the **edit button** to access full formatting options.

💬 **Use mentions** – Type `@username` to mention users inside a note.

🎯 **Navigate with keyboard** – Use **arrow keys** to select mentions and **Enter** to insert them.

📋 **Copy or delete** – Click the **copy button** to copy the note or **delete** it permanently.

---

## 🔥 Possible Improvements & Future Features

✨ **Testing** – Add unit tests using `Vitest`.  
✨ **Tailwind Tokens** – Improve styling with better theme support.  
✨ **Enhanced Features** – Attach images, create to-do lists, support markdown.  
✨ **Rich Mentions** – Show more details when mentioning users.  
✨ **Drag & Drop** – Organize notes with an intuitive UI.  
✨ **Offline Mode** – Cache notes for offline usage.  
✨ **Dark Mode** – Add theme switching.

---

## 🤝 Contributing

Feel free to **fork** the project, submit **issues**, and create **pull requests**! 🚀

---

## 📜 License

MIT License. Free to use and modify.
