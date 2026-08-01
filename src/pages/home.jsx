import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { volumeTitle } from "../config/volumes.js";
import { EXPLORE_SECTIONS } from "../config/categories.js";
import { ICON_PATHS } from "../config/icons.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Icon from "../components/icon.jsx";

const NOVEL_URL = "https://www.webnovel.com/book/11022733006234505";

// Tailwind extracts class names statically, so each accent variant has to
// appear as a complete literal rather than being interpolated per step.
const STEP_ACCENTS = {
  primary: "text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-content group-hover:shadow-primary/40",
  secondary: "text-secondary border-secondary/20 group-hover:bg-secondary group-hover:text-secondary-content group-hover:shadow-secondary/40",
  accent: "text-accent border-accent/20 group-hover:bg-accent group-hover:text-accent-content group-hover:shadow-accent/40",
};

const HOW_IT_WORKS = [
  {
    title: "Pick your volume",
    body: "Use the volume selector in the navbar to choose exactly how far you have read in the series.",
    accent: STEP_ACCENTS.primary,
  },
  {
    title: "Browse safely",
    body: "Entries introduced in later volumes are completely hidden, and spoiler blocks stay collapsed until you reach them.",
    accent: STEP_ACCENTS.secondary,
  },
  {
    title: "Progress naturally",
    body: "Come back and update your volume level as you advance to unlock new character profiles, pathways, and lore.",
    accent: STEP_ACCENTS.accent,
  },
];

function SectionCard({ label, path, icon }) {
  return (
    <Link
      to={path}
      className="group relative overflow-hidden rounded-[1.5rem] bg-base-100/30 backdrop-blur-xl border border-white/10 p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-base-100/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative flex flex-col items-center text-center gap-4">
        <div className="p-4 rounded-full bg-base-200/50 text-base-content border border-white/5 group-hover:bg-primary group-hover:text-primary-content group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
          <Icon path={icon} className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-wide group-hover:text-primary transition-colors duration-300">
            {label}
          </h3>
          <p className="text-sm text-base-content/70 mt-2 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
            Explore the mysteries of {label.toLowerCase()}
          </p>
        </div>
      </div>
    </Link>
  );
}

function HowItWorksStep({ step, title, body, accent }) {
  return (
    <div className="relative z-10 group text-center space-y-6 p-8 rounded-[2rem] hover:bg-base-100/40 hover:backdrop-blur-xl border border-transparent hover:border-white/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={`w-20 h-20 mx-auto rounded-full bg-base-200 flex items-center justify-center text-2xl font-black border transition-all duration-500 shadow-lg group-hover:scale-110 ${accent}`}
      >
        {step}
      </div>
      <h3 className="text-2xl font-bold tracking-wide">{title}</h3>
      <p className="text-base-content/70 leading-relaxed font-medium">{body}</p>
    </div>
  );
}

export default function HomePage() {
  const selectedVolume = useSelectedVolume();
  usePageTitle("LOTM Wiki");

  return (
    <div className="min-h-screen pb-16 font-sans">
      <main className="container mx-auto px-4 pt-12 space-y-20">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-base-300/30 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-accent/20 blur-[100px] pointer-events-none mix-blend-screen" />

          <div className="relative flex flex-col lg:flex-row items-center gap-12 p-10 lg:p-16 w-full max-w-none">
            <div className="flex-1 space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-100/40 border border-white/10 backdrop-blur-md shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <span className="text-sm font-semibold tracking-wide text-base-content">
                  Spoiler-Free Reading: Volume {selectedVolume}
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
                  <span className="block text-base-content drop-shadow-md">Lord of the</span>
                  <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm pb-2">
                    Mysteries Wiki
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-base-content/80 max-w-2xl leading-relaxed font-medium">
                  Journey through the Beyonder pathways, uncover ancient artifacts, and explore the vast world of deities and secret organizations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to="/characters" className="btn btn-primary btn-lg rounded-full px-8 shadow-[0_0_20px_rgba(0,0,0,0)] hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                  Enter the Archives
                </Link>
                <a
                  href={NOVEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg rounded-full px-8 border-white/20 hover:border-accent hover:bg-accent/10 hover:text-accent backdrop-blur-sm transition-all duration-300"
                >
                  Read the Novel
                  <Icon path={ICON_PATHS.externalLink} className="h-5 w-5 ml-2" />
                </a>
              </div>
            </div>

            {/* Volume Status Card */}
            <div className="w-full lg:w-96 shrink-0 group z-10 perspective-[1000px]">
              <div className="relative rounded-[2rem] bg-base-100/40 backdrop-blur-xl border border-white/10 p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:rotate-y-[-5deg] hover:rotate-x-[5deg] hover:bg-base-100/50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative space-y-6">
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">Current Reading Point</h2>
                    <div className="h-1 w-16 bg-gradient-to-r from-primary to-accent rounded-full" />
                  </div>

                  <div>
                    <div className="text-4xl font-black bg-gradient-to-br from-base-content to-base-content/50 bg-clip-text text-transparent">
                      {volumeTitle(selectedVolume)}
                    </div>
                  </div>

                  <p className="text-sm text-base-content/70 leading-relaxed font-medium">
                    Content from later volumes is safely hidden. Adjust your volume in the navigation bar to reveal more secrets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-base-content drop-shadow-sm">Explore the Wiki</h2>
              <p className="text-base-content/70 font-medium text-lg">Delve into the various archives of knowledge.</p>
            </div>
            <Link to="/search" className="btn btn-ghost rounded-full hover:bg-base-200/50 backdrop-blur-sm border border-white/5 transition-all shadow-sm">
              <Icon path={ICON_PATHS.search} className="h-5 w-5 mr-2 text-base-content/70" />
              Search Everything
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPLORE_SECTIONS.map((section) => (
              <SectionCard key={section.path} {...section} />
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-base-300/40 backdrop-blur-2xl border border-white/10 p-10 lg:p-16 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight drop-shadow-sm">How the Spoiler Filter Works</h2>
              <p className="text-base-content/70 text-lg font-medium">Navigate the dangerous world of Beyonders without fearing premature revelations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 z-0" />

              {HOW_IT_WORKS.map((entry, index) => (
                <HowItWorksStep key={entry.title} step={index + 1} {...entry} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
