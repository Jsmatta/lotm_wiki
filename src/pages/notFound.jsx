import { Link } from "react-router-dom";
import { useEffect } from "preact/hooks";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found | LOTM Wiki";
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center p-8 bg-base-100/90 backdrop-blur-sm rounded-lg shadow-xl border-4 border-primary max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="mb-6 opacity-80">The artifact you are looking for has been sealed or does not exist in this volume.</p>
        <Link to="/" className="btn btn-primary">
          Return to Sanctuary
        </Link>
      </div>
    </div>
  );
}
