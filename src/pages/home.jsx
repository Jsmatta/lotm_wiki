import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { volumeTitle } from "../config/volumes.js";
import { EXPLORE_SECTIONS } from "../config/categories.js";
import { ICON_PATHS } from "../config/icons.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Icon from "../components/icon.jsx";

const NOVEL_URL = "https://www.webnovel.com/book/11022733006234505";

const STEP_ACCENTS = {
  primary: "bg-primary text-primary-content border-black",
  secondary: "bg-secondary text-secondary-content border-black",
  accent: "bg-accent text-accent-content border-black",
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "SET CLEARANCE LEVEL",
    body: "Use the volume selector in the navbar to define your exact current reading milestone in the series.",
    accent: STEP_ACCENTS.primary,
  },
  {
    step: "02",
    title: "CLASSIFIED REDACTIONS",
    body: "Entries introduced in future volumes remain completely locked, and internal spoilers stay sealed.",
    accent: STEP_ACCENTS.secondary,
  },
  {
    step: "03",
    title: "ADVANCE ACCESS",
    body: "Upgrade your volume level as you read to progressively declassify deeper pathways, deities, and artifacts.",
    accent: STEP_ACCENTS.accent,
  },
];

function SectionCard({ label, path, icon }) {
  return (
    <Link
      to={path}
      className="group block bg-base-200 border-2 border-base-content brutal-shadow brutal-card p-6 relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="w-12 h-12 bg-base-100 border-2 border-base-content flex items-center justify-center brutal-shadow-xs group-hover:bg-primary group-hover:text-primary-content transition-colors">
          <Icon path={icon} className="h-6 w-6" strokeWidth={2} />
        </div>
        <span className="font-mono text-[10px] font-bold tracking-widest text-base-content/60 border border-base-content/30 px-1.5 py-0.5 bg-base-100 uppercase">
          ARCHIVE
        </span>
      </div>

      <div>
        <h3 className="text-xl font-bold font-mono tracking-tight uppercase group-hover:text-primary transition-colors">
          {label}
        </h3>
        <p className="text-xs text-base-content/80 mt-2 font-mono leading-relaxed">
          Access classified records, dossiers, and lore regarding {label.toLowerCase()}.
        </p>
      </div>

      <div className="mt-5 pt-3 border-t-2 border-base-content/10 flex items-center justify-between font-mono text-xs font-bold text-primary group-hover:text-accent transition-colors">
        <span>ACCESS DOSSIER</span>
        <span>→</span>
      </div>
    </Link>
  );
}

function HowItWorksStep({ step, title, body, accent }) {
  return (
    <div className="bg-base-100 border-2 border-base-content brutal-shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 border-2 font-mono font-black text-sm flex items-center justify-center brutal-shadow-xs ${accent}`}>
          {step}
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-base-content/60">
          PROTOCOL
        </span>
      </div>
      <h3 className="text-lg font-bold font-mono uppercase tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed font-sans">{body}</p>
    </div>
  );
}

export default function HomePage() {
  const selectedVolume = useSelectedVolume();
  usePageTitle("LOTM Wiki");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6 space-y-16">

        {/* HERO SECTION */}
        <section className="bg-base-200 border-2 border-base-content brutal-shadow-lg p-6 sm:p-10 lg:p-12 relative">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-10">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-base-100 border-2 border-base-content font-mono text-xs font-bold uppercase tracking-wider brutal-shadow-xs">
                <span className="w-2.5 h-2.5 bg-primary border border-black animate-pulse"></span>
                <span>SECURITY CLEARANCE: VOLUME {selectedVolume}</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none">
                  <span className="block text-base-content">LORD OF THE</span>
                  <span className="block text-primary underline decoration-4 decoration-accent underline-offset-8 mt-2">
                    MYSTERIES
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-base-content/80 max-w-xl font-mono pt-2 leading-relaxed">
                  Confidential archive covering Beyonder pathways, sealed artifacts, ancient deities, and secret occult factions.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/characters"
                  className="btn btn-primary rounded-none border-2 border-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider brutal-shadow brutal-btn px-6"
                >
                  ACCESS ARCHIVES →
                </Link>
                <a
                  href={NOVEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline rounded-none border-2 border-base-content font-mono font-bold text-xs sm:text-sm uppercase tracking-wider brutal-shadow-xs brutal-btn px-6 bg-base-100"
                >
                  READ ORIGINAL NOVEL
                  <Icon path={ICON_PATHS.externalLink} className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>

            {/* Volume Status Dossier */}
            <div className="w-full lg:w-88 shrink-0 bg-base-100 border-2 border-base-content brutal-shadow p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-base-content/20 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                  [ DOSSIER STATUS ]
                </span>
                <span className="badge badge-accent font-mono text-[10px] font-bold rounded-none border border-black">
                  ACTIVE
                </span>
              </div>

              <div>
                <div className="font-mono text-[11px] text-base-content/60 uppercase">Current Reading Point:</div>
                <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-mono text-base-content mt-1">
                  {volumeTitle(selectedVolume)}
                </div>
              </div>

              <div className="p-3 bg-base-200 border-2 border-base-content/30 font-mono text-xs text-base-content/80 leading-relaxed">
                Spoilers beyond Volume {selectedVolume} are strictly quarantined. Adjust reading clearance in the header bar.
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-base-content/20 pb-4">
            <div>
              <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                // ARCHIVE DIRECTORIES
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-mono mt-1">
                Explore the Wiki
              </h2>
            </div>
            <Link
              to="/search"
              className="btn btn-sm rounded-none border-2 border-base-content font-mono text-xs font-bold uppercase bg-base-200 brutal-shadow-xs brutal-btn"
            >
              <Icon path={ICON_PATHS.search} className="h-4 w-4 mr-1.5" />
              GLOBAL SEARCH
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {EXPLORE_SECTIONS.map((section) => (
              <SectionCard key={section.path} {...section} />
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="bg-base-200 border-2 border-base-content brutal-shadow-lg p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="border-b-2 border-base-content/20 pb-4">
            <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
              // SECURITY PROTOCOLS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-mono mt-1">
              How the Spoiler Quarantine Operates
            </h2>
            <p className="text-xs sm:text-sm text-base-content/80 font-mono mt-1">
              Navigate the dangerous world of Beyonders without risking premature revelations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((entry) => (
              <HowItWorksStep key={entry.step} {...entry} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
