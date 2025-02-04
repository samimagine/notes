import { Routes, Route } from "react-router-dom";
import Canvas from "./components/Canvas";
import NotePage from "./components/NotePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Canvas />} />
      <Route path="/note/:id" element={<NotePage />} />
    </Routes>
  );
}

export default App;
