import { useState } from "preact/hooks";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home.jsx";
import Characters from "./pages/characters.jsx";
import Pathways from "./pages/pathways.jsx";
import CharacterDetail from "./pages/characterDetail.jsx";
import PathwayDetail from "./pages/pathwayDetail.jsx";
import Navbar from "./components/navbar.jsx";



export function App() {
  // Get saved volume from localStorage, default to 0 if not found
  const getSavedVolume = () => {
    const saved = localStorage.getItem('selectedVolume');
    return saved !== null ? parseInt(saved) : 0;
  };
  
  const [selectedVolume, setSelectedVolume] = useState(getSavedVolume());

  const handleVolumeChange = (volume) => {
    setSelectedVolume(volume);
    localStorage.setItem('selectedVolume', volume.toString());
  };

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
        <Navbar onVolumeChange={handleVolumeChange} selectedVolume={selectedVolume} />
        <div className="pt-20">
          <Routes>
            <Route
              path="/"
              element={<Home selectedVolume={selectedVolume} />}
            />
            <Route
              path="/characters"
              element={<Characters selectedVolume={selectedVolume} />}
            />
            <Route
              path="/characters/:id"
              element={<CharacterDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/pathways"
              element={<Pathways selectedVolume={selectedVolume} />}
            />
            <Route
              path="/pathways/:id"
              element={<PathwayDetail selectedVolume={selectedVolume} />}
            />

          </Routes>
        </div>
        <footer className="footer sm:footer-horizontal footer-center bg-base-300/90 text-base-content p-4">
          <aside>
            <p>
              © 2026 Created by:  
              <a href="https://github.com/jsmatta" target="_blank" rel="noopener noreferrer" className="underline italic">jsmatta</a>
            </p>
          </aside>
        </footer>
      </div>
    </Router>
  );
}
