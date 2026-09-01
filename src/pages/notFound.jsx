import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6 py-8">
        <div className="bg-base-200 border-2 border-base-content brutal-shadow p-8 font-mono space-y-4 max-w-lg mx-auto text-center">
          <div className="inline-block bg-warning text-warning-content font-mono font-bold text-xs px-2 py-0.5 border border-black uppercase">
            [404 // VOID SECTOR]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-base-content">
            Record Does Not Exist
          </h1>
          <p className="text-xs text-base-content/80">
            The requested coordinate or document address cannot be found in the current archival timeline.
          </p>
          <Link
            to="/"
            className="btn btn-sm btn-primary rounded-none border-2 border-black font-mono font-bold uppercase tracking-wider brutal-shadow-xs brutal-btn mt-4 inline-block"
          >
            ← RETURN TO ARCHIVE CORE
          </Link>
        </div>
      </main>
    </div>
  );
}
