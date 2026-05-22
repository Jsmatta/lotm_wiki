import React from "react";
import { volumes } from "../components/volumeSelector.jsx";

export default function Volumes({ selectedVolume }) {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <section className="bg-base-100/90 backdrop-blur-sm rounded-lg p-6 shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Volumes</h1>
          <p className="mt-3 max-w-3xl text-base-content/80">
            The selected volume controls spoiler-safe filtering across the wiki.
            Content introduced after the active volume stays hidden.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {volumes.map((volume, index) => (
            <article
              key={volume}
              className={`card bg-base-100/95 shadow-xl border ${
                selectedVolume === index ? "border-primary" : "border-accent/40"
              }`}
            >
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="card-title">{volume}</h2>
                  <div className="badge badge-outline">Volume {index}</div>
                </div>
                <p className="text-sm text-base-content/75">
                  {selectedVolume === index
                    ? "This is your active spoiler boundary."
                    : index < selectedVolume
                      ? "Content from this volume is currently visible."
                      : "Content introduced here is currently hidden."}
                </p>
                {selectedVolume === index && (
                  <div className="badge badge-primary w-fit">Selected</div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
