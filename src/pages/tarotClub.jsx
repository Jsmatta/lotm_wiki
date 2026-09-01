import { useState } from "preact/hooks";
import { Link } from "react-router-dom";
import { usePageTitle } from "../utils/usePageTitle.js";
import { useSelectedVolume } from "../utils/volumeContext.jsx";
import Modal from "../components/modal.jsx";

const TAROT_MEMBERS = [
  {
    arcana: "0",
    roman: "0",
    card: "THE FOOL",
    codename: "Mr. Fool",
    identity: "Klein Moretti",
    pathway: "Fool Pathway (Seer)",
    role: "Lord of the Mysteries // Convener & Supreme Entity",
    introducedInVolume: 1,
    characterId: "klein_moretti",
    description: "The mysterious leader who created the Tarot Club above the gray fog. Revered as an ancient deity awakening from slumber.",
  },
  {
    arcana: "VII",
    roman: "VII",
    card: "JUSTICE",
    codename: "Miss Justice",
    identity: "Audrey Hall",
    pathway: "Visionary Pathway (Spectator)",
    role: "Financial Benefactor & Group Psychiatrist",
    introducedInVolume: 1,
    characterId: "audrey_hall",
    description: "Noble heiress of the Loen Kingdom. The initial convener along with Alger Wilson, providing immense wealth and intelligence.",
  },
  {
    arcana: "XII",
    roman: "XII",
    card: "THE HANGED MAN",
    codename: "Mr. Hanged Man",
    identity: "Alger Wilson",
    pathway: "Tyrant Pathway (Sailor)",
    role: "Occult Senior Advisor & Maritime Commander",
    introducedInVolume: 1,
    characterId: "alger_wilson",
    description: "Captain of the Blue Avenger and Church of Storms insider with extensive maritime occult knowledge.",
  },
  {
    arcana: "XIX",
    roman: "XIX",
    card: "THE SUN",
    codename: "The Sun",
    identity: "Derrick Berg",
    pathway: "Sun Pathway (Bard)",
    role: "Chronicler of the Forsaken Land of the Gods",
    introducedInVolume: 1,
    characterId: "derrick_berg",
    description: "Youth from the City of Silver in the Forsaken Land. Provides ancient Second and Third Epoch historical records.",
  },
  {
    arcana: "XXI",
    roman: "XXI",
    card: "THE WORLD",
    codename: "Mr. World",
    identity: "Gehrman Sparrow (Klein's Marionette)",
    pathway: "Fool Pathway (Seer)",
    role: "Chief Executioner & Occult Mercenary",
    introducedInVolume: 2,
    characterId: "klein_moretti",
    description: "The feared crazy adventurer of the Five Seas. Used by Mr. Fool to conduct hazardous physical trades and commissions.",
  },
  {
    arcana: "I",
    roman: "I",
    card: "THE MAGICIAN",
    codename: "Miss Magician",
    identity: "Fors Wall",
    pathway: "Door Pathway (Apprentice)",
    role: "Astrologer & Backlund Intel Collector",
    introducedInVolume: 2,
    characterId: "fors_wall",
    description: "Best-selling novelist and close friend of Xio Derecha. Relies on the Tarot Club to survive full moon ravings.",
  },
  {
    arcana: "XVIII",
    roman: "XVIII",
    card: "THE MOON",
    codename: "Mr. Moon",
    identity: "Emlyn White",
    pathway: "Moon Pathway (Apothecary)",
    role: "Sanguine Liaison & Potion Concocter",
    introducedInVolume: 2,
    characterId: "emlyn_white",
    description: "Doll-loving vampire/Sanguine who worships the Earth Mother and trades rare biological concoctions.",
  },
  {
    arcana: "IX",
    roman: "IX",
    card: "THE HERMIT",
    codename: "Ma'am Hermit",
    identity: "Cattleya",
    pathway: "Hermit Pathway (Mystery Pryer)",
    role: "Pirate Admiral & High-Sequence Scholar",
    introducedInVolume: 3,
    characterId: "cattleya",
    description: "Admiral of Stars and former disciple of Queen Mystic. Provides Roselle Gustav's secret diary pages.",
  },
  {
    arcana: "XVII",
    roman: "XVII",
    card: "THE STAR",
    codename: "Mr. Star",
    identity: "Leonard Mitchell",
    pathway: "Darkness Pathway (Sleepless)",
    role: "Nighthawk Liaison & High-Level Infiltrator",
    introducedInVolume: 4,
    characterId: "leonard_mitchell",
    description: "Former Tingen Nighthawk with a parasitic Grand Patriarch of the Zoroast Family inside him.",
  },
];

export default function TarotClubPage() {
  const selectedVolume = useSelectedVolume();
  const [activeMember, setActiveMember] = useState(null);

  usePageTitle("The Tarot Club");

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-3 sm:px-6 space-y-12">
        {/* Header Section */}
        <section className="bg-base-200 border-2 border-base-content brutal-shadow p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-base-content/20 pb-4">
            <div>
              <div className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
                // DIVINE CONCLAVE //
              </div>
              <h1 className="text-3xl sm:text-5xl font-black uppercase font-mono tracking-tight text-base-content mt-1">
                The Tarot Club Gathering
              </h1>
              <p className="mt-2 max-w-2xl text-xs sm:text-sm text-base-content/80 font-mono leading-relaxed">
                The supreme secret society convened every Monday at 3 PM above the gray fog. Members gather at the bronze table to exchange intelligence, forbidden mysticism, and Blasphemy Slate pages.
              </p>
            </div>

            <div className="px-3 py-2 bg-base-100 border-2 border-base-content font-mono text-xs font-bold uppercase brutal-shadow-xs shrink-0">
              <span className="text-base-content/60">CLEARANCE: </span>
              <span className="text-primary">VOL. {selectedVolume}</span>
            </div>
          </div>
        </section>

        {/* Tarot Arcana Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {TAROT_MEMBERS.map((member) => {
            const isUnlocked = selectedVolume >= member.introducedInVolume;

            return (
              <div
                key={member.card}
                onClick={() => isUnlocked && setActiveMember(member)}
                className={`border-2 border-base-content brutal-shadow brutal-card p-6 flex flex-col justify-between gap-4 transition-all ${
                  isUnlocked
                    ? "bg-base-200 cursor-pointer hover:border-primary"
                    : "bg-base-300/80 border-dashed border-base-content/40 opacity-70 cursor-not-allowed"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b-2 border-base-content/15 pb-2 mb-3 font-mono text-xs">
                    <span className="font-black text-primary bg-base-100 px-2 py-0.5 border border-black">
                      ARCANA [{member.roman}]
                    </span>
                    <span className="text-[10px] font-bold uppercase text-base-content/60">
                      VOL. {member.introducedInVolume} REQUIRED
                    </span>
                  </div>

                  {isUnlocked ? (
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black font-mono uppercase tracking-tight text-base-content">
                        {member.card}
                      </h2>
                      <div className="inline-block bg-accent text-accent-content font-mono text-[10px] font-bold px-2 py-0.5 border border-black uppercase">
                        {member.codename}
                      </div>
                      <div className="font-mono text-xs text-base-content/75 pt-2">
                        <span className="font-bold text-base-content">MEMBER: </span>
                        {member.identity}
                      </div>
                      <div className="font-mono text-xs text-base-content/75">
                        <span className="font-bold text-base-content">PATHWAY: </span>
                        {member.pathway}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center space-y-2 font-mono">
                      <div className="text-sm font-bold text-warning uppercase">[!] SEAT REDACTED</div>
                      <p className="text-[11px] text-base-content/60">
                        Higher volume clearance required to unlock this Major Arcana seat.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t-2 border-base-content/15 flex items-center justify-between font-mono text-xs font-bold">
                  {isUnlocked ? (
                    <>
                      <span className="text-primary">INSPECT SEAT DOSSIER</span>
                      <span className="text-primary">→</span>
                    </>
                  ) : (
                    <span className="text-base-content/40">CLASSIFIED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Details Modal */}
        {activeMember && (
          <Modal isOpen={Boolean(activeMember)} onClose={() => setActiveMember(null)} title={`TAROT SEAT // ${activeMember.card}`}>
            <div className="font-mono space-y-4 text-xs">
              <div className="p-3 bg-base-100 border-2 border-base-content space-y-2">
                <div className="flex items-center justify-between border-b border-base-content/20 pb-2">
                  <span className="text-base-content/60 font-bold">CODENAME:</span>
                  <span className="font-black text-accent uppercase text-sm">{activeMember.codename}</span>
                </div>
                <div className="flex items-center justify-between border-b border-base-content/20 pb-2">
                  <span className="text-base-content/60 font-bold">REAL IDENTITY:</span>
                  <span className="font-bold uppercase text-primary">{activeMember.identity}</span>
                </div>
                <div className="flex items-center justify-between border-b border-base-content/20 pb-2">
                  <span className="text-base-content/60 font-bold">BEYONDER PATHWAY:</span>
                  <span className="font-bold uppercase">{activeMember.pathway}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60 font-bold">OFFICIAL ROLE:</span>
                  <span className="font-bold uppercase">{activeMember.role}</span>
                </div>
              </div>

              <div className="p-3 bg-base-100 border-2 border-base-content space-y-1">
                <div className="font-bold uppercase text-[10px] text-base-content/60">// INTELLIGENCE BRIEF</div>
                <p className="font-sans text-xs text-base-content/85 leading-relaxed">
                  {activeMember.description}
                </p>
              </div>

              <Link
                to={`/characters/${activeMember.characterId}`}
                className="btn btn-sm btn-primary rounded-none border-2 border-black font-mono font-bold uppercase tracking-wider w-full brutal-shadow-xs brutal-btn mt-4 block text-center"
              >
                OPEN FULL CHARACTER PROFILE DOSSIER →
              </Link>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}
