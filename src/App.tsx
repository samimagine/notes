import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Canvas from "./components/Canvas";
import NotePage from "./components/NotePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Canvas />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes>
    </Router>
  );
}

export default App;
