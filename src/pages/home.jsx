import React from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/lotm_logo.webp"; // Import the image

export default function Home() {
  return (
    <div className="min-h-screen min-w-screen bg-base-200 flex flex-col items-center pb-20 -mt-20">
      <main className="w-full">
        <div
          className="hero min-h-screen flex flex-col justify-center px-4"
          style={{
            backgroundImage: "url(https://i.redd.it/wxd0v1ggbede1.jpeg)",
          }}
        >
          <div className="hero-content text-center border border-primary rounded-lg p-4 md:p-8 flex-col lg:flex-row-reverse gap-6 lg:gap-12 bg-base-100 shadow-lg">
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
                  to="/lotm_wiki/characters"
                  className="btn btn-primary normal-case text-base"
                >
                  Characters
                </Link>
                <Link
                  to="/lotm_wiki/pathways"
                  className="btn btn-secondary normal-case text-base"
                >
                  Pathways
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
