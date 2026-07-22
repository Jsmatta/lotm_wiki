import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { volumes } from "../components/volumeSelector.jsx";

export default function VolumesPage({ selectedVolume }) {
  usePageTitle("Volumes");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Volumes</h1>
          <p className="mt-3 text-base-content/80">
            Each volume tracks the point in the story where content is safe to reveal.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {volumes.map((volume, index) => (
            <div
              key={volume}
              className={`card border ${index === selectedVolume ? "border-accent bg-accent/5" : "border-base-300 bg-base-100/90"}`}
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="card-title">Volume {index}</h2>
                  {index === selectedVolume && <span className="badge badge-accent">Current</span>}
                </div>
                <p className="text-base-content/80">{volume}</p>
                <Link to="/characters" className="btn btn-sm btn-outline mt-3">Browse entries</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
