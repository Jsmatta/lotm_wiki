import { useState } from "preact/hooks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home.jsx";
import Characters from "./pages/characters.jsx";
import Pathways from "./pages/pathways.jsx";
import Navbar from "./components/navbar.jsx";

export function App() {
  const [selectedVolume, setSelectedVolume] = useState(0);

  return (
    <Router>
      <div 
        className="min-h-screen bg-base-300"
        style={{
          backgroundImage: "url(https://i.redd.it/wxd0v1ggbede1.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <Navbar onVolumeChange={setSelectedVolume} />
        <div className="pt-20">
          <Routes>
            <Route
              path="/"
              element={<Home selectedVolume={selectedVolume} />}
            />
            <Route
              path="/lotm_wiki/"
              element={<Home selectedVolume={selectedVolume} />}
            />
            <Route
              path="/lotm_wiki/characters"
              element={<Characters selectedVolume={selectedVolume} />}
            />
            <Route
              path="/lotm_wiki/pathways"
              element={<Pathways selectedVolume={selectedVolume} />}
            />
          </Routes>
        </div>
        <footer className="footer sm:footer-horizontal footer-center bg-base-300/90 text-base-content p-4">
          <aside>
            <p>
              © 2026 Created by:  
              <a href="https://github.com/jsmatta" target="_blank" rel="noopener noreferrer" className="underline">jsmatta</a>
            </p>
          </aside>
        </footer>
      </div>
    </Router>
  );
}
