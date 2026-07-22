import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { volumes } from "../components/volumeSelector.jsx";
import { sections } from "../utils/sections.js";

const NOVEL_URL = "https://www.webnovel.com/book/11022733006234505";

const sectionIcons = {
  Home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  Volumes: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  Characters: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  Places: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
  Pathways: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  Gods: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.16c.969 0 1.371 1.24.588 1.81l-3.365 2.444a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118l-3.365-2.444a1 1 0 00-1.176 0l-3.365 2.444c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L4.06 9.384c-.783-.57-.38-1.81.588-1.81h4.16a1 1 0 00.95-.69l1.286-3.957z",
  Organizations: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  Spells: "M13 10V3L4 14h7v7l9-11h-7z",
  "Sealed Artifacts": "M12 11c0-1.105-.895-2-2-2S8 9.895 8 11s.895 2 2 2 2-.895 2-2zm0 0c0 1.105.895 2 2 2s2-.895 2-2-.895-2-2-2-2 .895-2 2zm-2 0H5m14 0h-5",
};

function SectionCard({ label, path }) {
  if (label === "Home") return null;

  return (
    <Link
      to={path}
      className="card bg-base-100/90 hover:bg-base-100 border border-accent/30 hover:border-accent shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="card-body flex flex-row items-center gap-4">
        <div className="shrink-0 p-3 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-content transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={sectionIcons[label] || sectionIcons.Pathways}
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="card-title text-lg group-hover:text-accent transition-colors">
            {label}
          </h3>
          <p className="text-sm text-base-content/70">
            Browse {label.toLowerCase()} from the series.
          </p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-base-content/30 group-hover:text-accent transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

export default function HomePage({ selectedVolume }) {
  usePageTitle("LOTM Wiki");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="hero bg-base-100/90 rounded-2xl shadow-xl border border-accent/40">
          <div className="hero-content flex-col lg:flex-row lg:items-start gap-8 p-8 w-full">
            <div className="max-w-2xl flex-1">
              <span className="badge badge-accent badge-outline mb-3">
                Reading up to Volume {selectedVolume}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold">Lord of the Mysteries Wiki</h1>
              <p className="py-4 text-lg text-base-content/80">
                Explore the lore, characters, pathways, and organizations of the
                Lord of the Mysteries series. Use the volume selector to hide spoilers
                and progress safely through the story.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/characters" className="btn btn-primary">
                  Browse Characters
                </Link>
                <a
                  href={NOVEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-accent"
                >
                  Read the Novel
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="card bg-base-200/70 border border-base-300 w-full max-w-md shrink-0">
              <div className="card-body">
                <h2 className="card-title">Current reading point</h2>
                <p className="text-sm text-base-content/80">
                  You are currently viewing content up to:
                </p>
                <div className="text-2xl font-bold text-accent">
                  {volumes[selectedVolume]}
                </div>
                <p className="text-sm text-base-content/70 mt-2">
                  Select a different volume from the navbar to reveal more content as
                  you read.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-base-100/90 rounded-2xl shadow-xl border border-accent/40 p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Explore the Wiki</h2>
              <p className="text-base-content/80 mt-1">
                Jump straight into any section.
              </p>
            </div>
            <Link to="/search" className="btn btn-ghost btn-sm">
              Search everything
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <SectionCard key={section.path} label={section.label} path={section.path} />
            ))}
          </div>
        </section>

        <section className="bg-base-100/90 rounded-2xl shadow-xl border border-accent/40 p-8">
          <h2 className="text-2xl font-bold mb-4">How the spoiler filter works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="badge badge-primary">1</div>
              <h3 className="font-bold">Pick your volume</h3>
              <p className="text-sm text-base-content/80">
                Use the volume selector in the navbar to choose how far you have read.
              </p>
            </div>
            <div className="space-y-2">
              <div className="badge badge-secondary">2</div>
              <h3 className="font-bold">Browse safely</h3>
              <p className="text-sm text-base-content/80">
                Entries introduced in later volumes are hidden, and spoiler blocks stay
                collapsed until you reach them.
              </p>
            </div>
            <div className="space-y-2">
              <div className="badge badge-accent">3</div>
              <h3 className="font-bold">Progress naturally</h3>
              <p className="text-sm text-base-content/80">
                Come back and raise your volume as you advance through the books.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
