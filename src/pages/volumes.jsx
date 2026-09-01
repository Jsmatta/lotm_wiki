import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { VOLUMES } from "../config/volumes.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";

export default function VolumesPage() {
  const selectedVolume = useSelectedVolume();
  usePageTitle("Volumes");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6">
        <section className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-8 mb-8">
          <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
            // CHRONICLES DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight mt-1">
            Story Volumes & Clearance
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-base-content/80 font-mono max-w-2xl leading-relaxed">
            Each volume marks an epoch in Klein Moretti's journey. Setting your clearance prevents early exposure to high-sequence revelations.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {VOLUMES.map((volume, index) => {
            const isCurrent = index === selectedVolume;

            return (
              <div
                key={volume}
                className={`border-2 border-base-content brutal-shadow brutal-card p-6 flex flex-col justify-between gap-4 ${
                  isCurrent ? "bg-base-100 border-primary" : "bg-base-200"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b-2 border-base-content/10 pb-3">
                    <span className="font-mono font-bold text-xs uppercase tracking-widest text-primary">
                      [ VOLUME {index} ]
                    </span>
                    {isCurrent && (
                      <span className="bg-accent text-accent-content font-mono font-bold text-[10px] px-2 py-0.5 border border-black uppercase tracking-wider">
                        ACTIVE CLEARANCE
                      </span>
                    )}
                  </div>
                  <h2 className="font-mono font-black text-xl uppercase tracking-tight text-base-content">
                    {volume}
                  </h2>
                  <p className="text-xs text-base-content/80 font-mono">
                    Declassifies lore and character profiles introduced up to Volume {index}.
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-base-content/10 flex items-center justify-between">
                  <Link
                    to="/characters"
                    className="btn btn-sm rounded-none border-2 border-base-content font-mono text-xs font-bold uppercase bg-base-100 brutal-shadow-xs brutal-btn w-full"
                  >
                    BROWSE VOLUME {index} ENTRIES →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
