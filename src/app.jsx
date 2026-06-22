import { useState } from "preact/hooks";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "preact/compat";
import "./index.css";
import Navbar from "./components/navbar.jsx";
import ErrorBoundary from "./components/errorBoundary.jsx";
import LoadingPage from "./components/loadingPage.jsx";

const Home = lazy(() => import("./pages/home.jsx"));
const Characters = lazy(() => import("./pages/characters.jsx"));
const Pathways = lazy(() => import("./pages/pathways.jsx"));
const Places = lazy(() => import("./pages/places.jsx"));
const Volumes = lazy(() => import("./pages/volumes.jsx"));
const Gods = lazy(() => import("./pages/gods.jsx"));
const Organizations = lazy(() => import("./pages/organizations.jsx"));
const Spells = lazy(() => import("./pages/spells.jsx"));
const SealedArtifacts = lazy(() => import("./pages/sealed_artifacts.jsx"));
const CharacterDetail = lazy(() => import("./pages/characterDetail.jsx"));
const PathwayDetail = lazy(() => import("./pages/pathwayDetail.jsx"));
const PlacesDetail = lazy(() => import("./pages/placesDetail.jsx"));
const GodDetail = lazy(() => import("./pages/godDetail.jsx"));
const OrganizationDetail = lazy(() => import("./pages/organizationDetail.jsx"));
const SpellDetail = lazy(() => import("./pages/spellDetail.jsx"));
const SealedArtifactDetail = lazy(() => import("./pages/sealedArtifactDetail.jsx"));
const Search = lazy(() => import("./pages/search.jsx"));
const NotFound = lazy(() => import("./pages/notFound.jsx"));



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
      {/* Fixed background rendered as its own GPU layer — avoids scroll repaint */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          backgroundImage: "url(https://i.redd.it/wxd0v1ggbede1.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="min-h-screen bg-base-300/10">
        <Navbar onVolumeChange={handleVolumeChange} selectedVolume={selectedVolume} />
        <div className="pt-20">
          <ErrorBoundary>
            <Suspense fallback={<LoadingPage fullScreen />}>
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
            <Route
              path="/places"
              element={<Places selectedVolume={selectedVolume} />}
            />
            <Route
              path="/places/:id"
              element={<PlacesDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/volumes"
              element={<Volumes selectedVolume={selectedVolume} />}
            />
            <Route
              path="/gods"
              element={<Gods selectedVolume={selectedVolume} />}
            />
            <Route
              path="/gods/:id"
              element={<GodDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/organizations"
              element={<Organizations selectedVolume={selectedVolume} />}
            />
            <Route
              path="/organizations/:id"
              element={<OrganizationDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/spells"
              element={<Spells selectedVolume={selectedVolume} />}
            />
            <Route
              path="/spells/:id"
              element={<SpellDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/sealed-artifacts"
              element={<SealedArtifacts selectedVolume={selectedVolume} />}
            />
            <Route
              path="/sealed-artifacts/:id"
              element={<SealedArtifactDetail selectedVolume={selectedVolume} />}
            />
            <Route
              path="/search"
              element={<Search selectedVolume={selectedVolume} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
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
