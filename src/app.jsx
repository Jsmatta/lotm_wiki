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
const NotFound = lazy(() => import("./pages/notFound.jsx"));

const BACKGROUND_IMAGE_URL = "https://i.redd.it/wxd0v1ggbede1.jpeg";

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

export function App() {
  usePreloadContent();

  return (
    <Router>
      <VolumeProvider>
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="min-h-screen bg-base-300/10">
          <Navbar />
          <div className="pt-20">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </div>
          <footer className="footer sm:footer-horizontal footer-center bg-base-300/90 text-base-content p-4">
            <aside>
              <p>
                © 2026 Created by:
                {" "}
                <a
                  href="https://github.com/jsmatta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline italic"
                >
                  jsmatta
                </a>
              </p>
            </aside>
          </footer>
        </div>
      </VolumeProvider>
    </Router>
  );
}
