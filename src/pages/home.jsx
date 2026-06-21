import React from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { sections } from "../components/sectionDropdown.jsx";
import logoImg from "../assets/lotm_logo.webp";

const sectionButtonColors = [
  "btn-primary",
  "btn-secondary",
  "btn-accent",
  "btn-info",
  "btn-success",
  "btn-warning",
  "btn-error",
  "btn-neutral",
];

export default function Home() {
  usePageTitle("Home");
  const categorySections = sections.filter((section) => section.path !== "/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="w-full px-4">
        <div className="hero min-h-screen flex flex-col justify-center">
          <div className="hero-content text-center border border-primary rounded-lg p-4 md:p-8 flex-col lg:flex-row-reverse gap-6 lg:gap-12 bg-base-100/90 shadow-xl backdrop-blur-sm">
            <a
              href="https://www.webnovel.com/book/11022733006234505"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read Lord of the Mysteries on Webnovel"
              className="w-full max-w-sm rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
            >
              <img
                src={logoImg}
                alt="Lord of the Mysteries cover"
                className="w-full rounded-lg shadow-2xl border-4 border-primary transition-transform duration-200 hover:scale-[1.02]"
              />
            </a>
            <div className="w-full max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold">LOTM Wiki</h1>
              <p className="py-5 w-full">
                Welcome to the LOTM Wiki! Your ultimate resource for everything
                related to the Lord of the Mysteries series. Dive into detailed
                character bios, volume summaries, and lore explanations to
                enhance your reading experience and filter out content you
                haven't reached yet.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                {categorySections.map((section, index) => (
                  <Link
                    key={section.path}
                    to={section.path}
                    className={`btn ${sectionButtonColors[index]} normal-case text-base`}
                  >
                    {section.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
