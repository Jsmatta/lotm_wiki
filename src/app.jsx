import { useEffect } from "preact/hooks";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "preact/compat";
import "./index.css";
import Navbar from "./components/navbar.jsx";
import ErrorBoundary from "./components/errorBoundary.jsx";
import LoadingPage from "./components/loadingPage.jsx";
import { preloadAllCategories } from "./utils/markdownLoader.js";
import { VolumeProvider } from "./utils/volumeContext.jsx";
import { CATEGORIES } from "./config/categories.js";

// Every category shares the same two page components, so they are split once
// here rather than once per category.
const WikiListPage = lazy(() => import("./components/wikiListPage.jsx"));
const WikiDetailPage = lazy(() => import("./components/wikiDetailPage.jsx"));
const Home = lazy(() => import("./pages/home.jsx"));
const Volumes = lazy(() => import("./pages/volumes.jsx"));
const Search = lazy(() => import("./pages/search.jsx"));
const TarotClub = lazy(() => import("./pages/tarotClub.jsx"));
const NotFound = lazy(() => import("./pages/notFound.jsx"));

/** Warm the markdown caches once the first paint is done. */
function usePreloadContent() {
  useEffect(() => {
    const preload = () => {
      preloadAllCategories().catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(preload, { timeout: 3000 });
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(preload, 500);
    return () => clearTimeout(timeoutId);
  }, []);
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage fullScreen message="Entering the archives…" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/volumes" element={<Volumes />} />
        <Route path="/tarot-club" element={<TarotClub />} />
        <Route path="/search" element={<Search />} />

        {/* One list + detail route per registry entry. */}
        {CATEGORIES.map((category) => (
          <Route key={category.key} path={category.route}>
            <Route index element={<WikiListPage category={category.key} />} />
            <Route path=":id" element={<WikiDetailPage category={category.key} />} />
          </Route>
        ))}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

const BACKGROUND_IMAGE_URL = "https://i.redd.it/wxd0v1ggbede1.jpeg";

export function App() {
  usePreloadContent();

  return (
    <Router>
      <VolumeProvider>
        {/* Underlying background image */}
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -2,
            backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Technical grid overlay on top of the background image */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-1 bg-occult-grid-overlay pointer-events-none"
        />

        <div className="min-h-screen text-base-content flex flex-col justify-between selection:bg-primary selection:text-primary-content">
          <div>
            <Navbar />
            <div className="pt-24 pb-12">
              <ErrorBoundary>
                <AppRoutes />
              </ErrorBoundary>
            </div>
          </div>
          <footer className="border-t-2 border-base-content/20 bg-base-300 text-base-content p-6 font-mono text-xs uppercase tracking-wider">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-primary border border-black"></span>
                <span className="font-bold text-sm tracking-tight text-base-content">LOTM ARCHIVES // CLASSIFIED</span>
              </div>
              <p className="text-base-content/70">
                ARCHIVE CURATOR:{" "}
                <a
                  href="https://github.com/jsmatta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary underline hover:text-accent transition-colors"
                >
                  jsmatta
                </a>
              </p>
            </div>
          </footer>
        </div>
      </VolumeProvider>
    </Router>
  );
}
