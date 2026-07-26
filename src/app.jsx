import { useState, useEffect } from "preact/hooks";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, startTransition } from "preact/compat";
import "./index.css";
import Navbar from "./components/navbar.jsx";
import ErrorBoundary from "./components/errorBoundary.jsx";
import LoadingPage from "./components/loadingPage.jsx";
import { preloadAllCategories } from "./utils/markdownLoader.js";
import { preloadAllImages } from "./utils/imageLoader.js";
import { VolumeProvider } from "./utils/volumeContext.jsx";

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

function preloadWikiAssets() {
  preloadAllCategories().catch(() => {});
  preloadAllImages().catch(() => {});
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage fullScreen message="Entering the archives…" />}>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/pathways" element={<Pathways />} />
          <Route path="/pathways/:id" element={<PathwayDetail />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:id" element={<PlacesDetail />} />
          <Route path="/volumes" element={<Volumes />} />
          <Route path="/gods" element={<Gods />} />
          <Route path="/gods/:id" element={<GodDetail />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/spells" element={<Spells />} />
          <Route path="/spells/:id" element={<SpellDetail />} />
          <Route path="/sealed-artifacts" element={<SealedArtifacts />} />
          <Route path="/sealed-artifacts/:id" element={<SealedArtifactDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Suspense>
  );
}

export function App() {
  const getSavedVolume = () => {
    const saved = localStorage.getItem("selectedVolume");
    return saved !== null ? parseInt(saved, 10) : 0;
  };

  const [selectedVolume, setSelectedVolume] = useState(getSavedVolume);

  useEffect(() => {
    const preload = () => preloadWikiAssets();

    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(preload, { timeout: 3000 });
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(preload, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleVolumeChange = (volume) => {
    startTransition(() => {
      setSelectedVolume(volume);
      localStorage.setItem("selectedVolume", volume.toString());
    });
  };

  return (
    <Router>
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
            <VolumeProvider value={selectedVolume}>
              <AppRoutes />
            </VolumeProvider>
          </ErrorBoundary>
        </div>
        <footer className="footer sm:footer-horizontal footer-center bg-base-300/90 text-base-content p-4">
          <aside>
            <p>
              © 2026 Created by:
              {" "}
              <a href="https://github.com/jsmatta" target="_blank" rel="noopener noreferrer" className="underline italic">jsmatta</a>
            </p>
          </aside>
        </footer>
      </div>
    </Router>
  );
}
