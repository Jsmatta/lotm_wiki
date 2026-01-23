import Navbar from "../components/navbar.jsx";
import logoImg from "../assets/lotm_logo.webp"; // Import the image
import { SectionDropdown } from "../components/sectionDropdown.jsx";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="bg-base-300 w-full min-h-screen">
        <div className="hero bg-base-300 min-h-screen flex flex-col justify-center px-4 -mt-20">
          <div className="hero-content text-cente border border-primary rounded-lg p-8 flex-col lg:flex-row-reverse gap-12 bg-base-100 shadow-lg">
            <img
              src={logoImg}
              className="max-w-sm rounded-lg shadow-2xl border-4 border-primary"
            />
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold">LOTM Wiki</h1>
              <p className="py-5  w-full">
                Welcome to the LOTM Wiki! Your ultimate resource for everything
                related to the Lord of the Mysteries series. Dive into detailed
                character bios, volume summaries, and lore explanations to
                enhance your reading experience and filter out content you
                haven't reached yet.
              </p>
              <SectionDropdown
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
