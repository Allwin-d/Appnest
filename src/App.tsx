
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GamingSite from "./components/GamingSite";
import Game from "./components/Game";
import PlayHopLogin from "./components/PlayHopLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GamingSite />} />
        <Route path="/memory" element={<Game />} />
        <Route path="/play-login" element={<PlayHopLogin />} />
      </Routes>
    </Router>
  );
}

export default App;


