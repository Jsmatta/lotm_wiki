import { useState } from 'preact/hooks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Home from './pages/home.jsx';
import Characters from './pages/characters.jsx';
import Pathways from './pages/pathways.jsx';
import Navbar from './components/navbar.jsx';

export function App() {
  const [selectedVolume, setSelectedVolume] = useState(0);

  return (
    <Router>
      <div className="min-h-screen bg-base-300">
        <Navbar onVolumeChange={setSelectedVolume} />
        <div className="pt-20">
          <Routes>
            <Route path="/" element={<Home selectedVolume={selectedVolume} />} />
            <Route path="/lotm_wiki/" element={<Home selectedVolume={selectedVolume} />} />
            <Route path="/lotm_wiki/characters" element={<Characters selectedVolume={selectedVolume} />} />
            <Route path="/lotm_wiki/pathways" element={<Pathways selectedVolume={selectedVolume} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

