import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { volumes } from "../components/volumeSelector.jsx";

export default function HomePage({ selectedVolume }) {
  usePageTitle("LOTM Wiki");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="hero bg-base-100/90 rounded-2xl shadow-xl border border-accent/40">
          <div className="hero-content flex-col lg:flex-row lg:items-start gap-8 p-8">
            <div className="max-w-2xl">
              <span className="badge badge-accent badge-outline mb-3">Volume {selectedVolume}</span>
              <h1 className="text-4xl md:text-5xl font-bold">LOTM Wiki</h1>
              <p className="py-4 text-lg text-base-content/80">
                Explore the lore of the Lord of the Mysteries series with spoiler-safe volume filtering.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/characters" className="btn btn-primary">Browse Characters</Link>
                <Link to="/volumes" className="btn btn-outline">View Volumes</Link>
              </div>
            </div>

            <div className="card bg-base-200/70 border border-base-300 w-full max-w-md">
              <div className="card-body">
                <h2 className="card-title">Current reading point</h2>
                <p className="text-sm text-base-content/80">You are currently viewing content up to:</p>
                <div className="text-2xl font-bold text-accent">{volumes[selectedVolume]}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
