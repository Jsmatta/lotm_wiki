const wikiPageAliases = {
  "Church of the Evernight Goddess": "Church_of_the_Evernight_Goddess",
  "Hunter Pathway": "Red_Priest_Pathway",
  "Mystery Pryer Pathway": "Hermit_Pathway",
  "Mysterious Space Above the Gray Fog": "Sefirah_Castle",
  "Sailor Pathway": "Tyrant_Pathway",
  "Sealed Artifact 2-049": "Antigonus_Family_Puppet",
  "Seer Pathway": "Fool_Pathway",
  "Sleepless Pathway": "Darkness_Pathway",
  "Spectator Pathway": "Visionary_Pathway",
  "Spirit Medium's Mirror": "Spirit_Medium%27s_Mirror",
};

function wikiPageFromName(name) {
  if (wikiPageAliases[name]) {
    return wikiPageAliases[name];
  }

  return encodeURIComponent(name.replaceAll(" ", "_"))
    .replaceAll("%2F", "/");
}

export function getExternalReferences(name) {
  return [
    {
      label: "LOTM Wiki",
      href: `https://lordofthemysteries.fandom.com/wiki/${wikiPageFromName(name)}`,
    },
    {
      label: "Read on Webnovel",
      href: "https://www.webnovel.com/book/11022733006234505",
    },
  ];
}
