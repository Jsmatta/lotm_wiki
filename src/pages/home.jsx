import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/lotm_logo.webp"; // Import the image

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <main className="w-full px-4">
        <div className="hero min-h-screen flex flex-col justify-center">
          <div className="hero-content text-center border border-primary rounded-lg p-4 md:p-8 flex-col lg:flex-row-reverse gap-6 lg:gap-12 bg-base-100/90 shadow-xl backdrop-blur-sm">
            <img
              src={logoImg}
              className="w-full max-w-sm rounded-lg shadow-2xl border-4 border-primary"
            />
            <div className="w-full max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold">LOTM Wiki</h1>
              <p className="py-5 w-full">
                Welcome to the LOTM Wiki! Your ultimate resource for everything
                related to the Lord of the Mysteries series. Dive into detailed
                character bios, volume summaries, and lore explanations to
                enhance your reading experience and filter out content you
                haven't reached yet.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/characters"
                  className="btn btn-primary normal-case text-base"
                >
                  Characters
                </Link>
                <Link
                  to="/pathways"
                  className="btn btn-secondary normal-case text-base"
                >
                  Pathways
                </Link>
                <Link
                  to="/places"
                  className="btn btn-accent normal-case text-base"
                >
                  Places
                </Link>
                <Link
                  to="/volumes"
                  className="btn btn-outline normal-case text-base"
                >
                  Volumes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
