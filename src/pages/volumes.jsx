import React from "react";
import { volumes } from "../components/volumeSelector.jsx";

const volumeDetails = {
  1: {
    chapters: "Chapters 1–213",
    summary: "Klein joins the Tingen Nighthawks and advances from Seer to Clown.",
    source: "https://lordofthemysteries.fandom.com/wiki/Volume_1:_Clown",
  },
  2: {
    chapters: "Chapters 214–482",
    summary: "As Sherlock Moriarty, Klein investigates Backlund and advances to Faceless.",
    source: "https://lordofthemysteries.fandom.com/wiki/Volume_2:_Faceless",
  },
  3: {
    chapters: "Chapters 483–732",
    summary: "As Gehrman Sparrow, Klein travels the Sonia Sea and advances to Marionettist.",
    source: "https://lordofthemysteries.fandom.com/wiki/Volume_3:_Traveler",
  },
};

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
          {volumes.map((volume, index) => {
            const details = volumeDetails[index];

            return (
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
                  {details ? (
                    <>
                      <div className="badge badge-secondary w-fit">
                        {details.chapters}
                      </div>
                      <p className="text-sm text-base-content/80">
                        {details.summary}
                      </p>
                      <a
                        href={details.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-primary text-sm w-fit"
                      >
                        Volume source
                      </a>
                    </>
                  ) : index > 3 ? (
                    <div className="badge badge-ghost w-fit">
                      Content pass not added yet
                    </div>
                  ) : null}
                  {selectedVolume === index && (
                    <div className="badge badge-primary w-fit">Selected</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
