#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

default_fallback="https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e1/LoM-logo.png/revision/latest?cb=20230228060027"

download_webp() {
  local category="$1"
  local filename="$2"
  local url="$3"
  local source_file="$tmp_dir/${category}-${filename}"
  local output_dir="$root_dir/src/assets/$category"

  mkdir -p "$output_dir"
  curl -L --fail --silent --show-error "$url" -o "$source_file"
  magick "$source_file" \
    -auto-orient \
    -thumbnail "1200x1200>" \
    -strip \
    -quality 82 \
    "$output_dir/$filename.webp"
}

download_page_image() {
  local category="$1"
  local filename="$2"
  local page="$3"
  local fallback="${4:-$default_fallback}"
  local metadata="$tmp_dir/${category}-${filename}.json"
  local url

  curl -L --fail --silent --show-error --get "https://lordofthemysteries.fandom.com/api.php" \
    --data-urlencode "action=query" \
    --data-urlencode "prop=pageimages" \
    --data-urlencode "piprop=thumbnail|original" \
    --data-urlencode "pithumbsize=1200" \
    --data-urlencode "titles=$page" \
    --data-urlencode "format=json" \
    -o "$metadata"

  url="$(jq -r '.query.pages[] | .thumbnail.source // .original.source // empty' "$metadata")"
  if [[ -z "$url" ]]; then
    url="$fallback"
  fi

  echo "Downloading $category/$filename from $page"
  download_webp "$category" "$filename" "$url"
}

fool_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c4/Fool_Official_Art.jpg/revision/latest?cb=20210306203923"
death_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/79/Death_Official_Art.jpg/revision/latest?cb=20210315030833"
error_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/cb/Error_Official_Art.jpg/revision/latest?cb=20210306203818"
red_priest_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/77/Red_Priest_Official_Art.jpg/revision/latest?cb=20210331193432"
visionary_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b0/Visionary_Official_Art.jpg/revision/latest?cb=20210306203953"
sun_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/95/Sun_Official_Art.jpg/revision/latest?cb=20210324021053"
twilight_giant_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f8/Twilight_Giant_Official_Art.jpg/revision/latest?cb=20210313054015"
forsaken_land_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f9/Forsaken_Land_of_the_Gods_Official.png/revision/latest?cb=20210821193210"
backlund_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a0/Backlund_Official_-_Factories.jpg/revision/latest?cb=20211026040057"
death_city_art="$death_art"
door_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/2/2a/Door_Official_Art.jpg/revision/latest?cb=20210306203859"
volume8_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/0/05/00812i0lly1gecuxgwwacj30nc0zgn5p.jpg/revision/latest?cb=20200502081341"

# Characters
download_page_image characters adam "Adam" "$visionary_art"
download_page_image characters amon "Amon" "$error_art"
download_page_image characters pallez_zoroast "Pallez Zoroast" "$error_art"
download_page_image characters daly_simone "Daly Simone" "$death_art"
download_page_image characters ince_zangwill "Ince Zangwill" "$death_art"
download_page_image characters cohinem "Cohinem" "$red_priest_art"
download_page_image characters ludwell "Ludwell" "$death_art"
download_page_image characters hvin_rambis "Hvin Rambis" "$visionary_art"
download_page_image characters qonas_kilgor "Qonas Kilgor" "$backlund_art"
download_page_image characters george_augustus_iii "George Augustus III" "$backlund_art"
download_page_image characters arianna "Arianna" "$fool_art"
download_page_image characters zaratul "Zaratul" "$fool_art"
download_page_image characters colin_iliad "Colin Iliad" "$forsaken_land_art"
download_page_image characters lovia_tiffany "Lovia Tiffany" "$forsaken_land_art"
download_page_image characters kotar "Kotar" "$fool_art"
download_page_image characters botis "Botis" "$door_art"
download_page_image characters dorian_gray_abraham "Dorian Gray Abraham" "$door_art"
download_page_image characters bethel_abraham "Bethel Abraham" "$door_art"
download_page_image characters roselle_gustav "Roselle Gustav" "$volume8_art"
download_page_image characters verdu_garcia "Verdu Garcia" "$door_art"
download_page_image characters medici "Medici" "$red_priest_art"
download_page_image characters alice_moretti "Alice Moretti" "$volume8_art"

# Gods and cosmic powers
download_page_image gods ancient_sun_god "Ancient Sun God" "$sun_art"
download_page_image gods eternal_blazing_sun "Eternal Blazing Sun" "$sun_art"
download_page_image gods god_of_combat "God of Combat" "$twilight_giant_art"
download_page_image gods god_of_knowledge_and_wisdom "God of Knowledge and Wisdom" "$sun_art"
download_page_image gods celestial_worthy "Celestial Worthy" "$fool_art"
download_page_image gods outer_deities "Outer Deities" "$volume8_art"
download_page_image gods lilith "Lilith" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/1/13/Moon_Official_Art.jpg/revision/latest?cb=20210324021029"

# Pathways
download_page_image pathways death_pathway "Death Pathway" "$death_art"
download_page_image pathways error_pathway "Error Pathway" "$error_art"
download_page_image pathways black_emperor_pathway "Black Emperor Pathway" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/42/Black_Emperor_Official_Art.jpg/revision/latest?cb=20210413193208"
download_page_image pathways demoness_pathway "Demoness Pathway" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a8/Demoness_Official_Art.jpg/revision/latest?cb=20210330072757"
download_page_image pathways twilight_giant_pathway "Twilight Giant Pathway" "$twilight_giant_art"

# Places
download_page_image places forsaken_land_of_the_gods "Forsaken Land of the Gods" "$forsaken_land_art"
download_page_image places chernobyl "Chernobyl" "$forsaken_land_art"
download_page_image places giant_kings_court "Giant King's Court" "$forsaken_land_art"
download_page_image places moon_city "Moon City" "$forsaken_land_art"
download_page_image places sonia_island "Sonia Island" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e0/Rorsted-Archipelago.jpg/revision/latest?cb=20240106122207"
download_page_image places belltaine_city "Belltaine City" "$backlund_art"
download_page_image places utopia "Utopia" "$fool_art"
download_page_image places calderon_city "Calderón City" "$death_city_art"
download_page_image places chaos_sea "Chaos Sea" "$volume8_art"
download_page_image places river_of_eternal_darkness "River of Eternal Darkness" "$death_city_art"

# Organizations
download_page_image organizations aurora_order "Aurora Order" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/3/3c/True_Creator_Official.jpg/revision/latest?cb=20210501071011"
download_page_image organizations eternal_life_society "Eternal Life Society" "$death_art"
download_page_image organizations church_of_the_earth_mother "Church of the Earth Mother" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/42/Earth_Mother_Emblem.jpg/revision/latest?cb=20210104161627"
download_page_image organizations demoness_sect "Demoness Sect" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a8/Demoness_Official_Art.jpg/revision/latest?cb=20210330072757"
download_page_image organizations jacob_family "Jacob Family" "$error_art"
download_page_image organizations church_of_the_god_of_combat "Church of the God of Combat" "$twilight_giant_art"
download_page_image organizations church_of_the_fool "Church of the Fool" "$fool_art"

# Artifacts and rituals
download_page_image sealed_artifacts cards_of_blasphemy "Cards of Blasphemy" "$fool_art"
download_page_image sealed_artifacts flower_of_blood "Flower of Blood" "$red_priest_art"
download_page_image sealed_artifacts lifes_cane "Life's Cane" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/4f/Mother_Official_Art.jpg/revision/latest?cb=20210322065604"
download_page_image sealed_artifacts magic_wishing_lamp "Magic Wishing Lamp" "$volume8_art"
download_page_image sealed_artifacts fate_siphon "Fate Siphon" "$error_art"
download_page_image sealed_artifacts artificial_death "Artificial Death" "$death_art"
download_page_image sealed_artifacts unshadowed_crucifix "Unshadowed Crucifix" "$sun_art"
download_page_image sealed_artifacts blasphemy_slate "Blasphemy Slate" "$sun_art"
download_page_image sealed_artifacts trunsoest_brass_book "Trunsoest Brass Book" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e7/Justiciar_Official_Art.jpg/revision/latest?cb=20210404070506"
download_page_image sealed_artifacts devils_oil_painting "Devil's Oil Painting" "$door_art"
download_page_image sealed_artifacts pale_death "Pale Death" "$death_art"
download_page_image spells kleins_apotheosis_ritual "Klein's Apotheosis Ritual" "$volume8_art"

download_page_image characters antigonus "Antigonus" "$fool_art"
download_page_image characters ouroboros "Ouroboros" "$volume8_art"

download_page_image gods lord_of_the_mysteries "Lord of the Mysteries" "$fool_art"
download_page_image gods mother_goddess_of_depravity "Mother Goddess of Depravity" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/4f/Mother_Official_Art.jpg/revision/latest?cb=20210322065604"
download_page_image gods son_of_chaos "Son of Chaos" "$volume8_art"
download_page_image gods god_of_almighty "God Almighty" "$visionary_art"

download_page_image places city_of_calamity "City of Calamity" "$red_priest_art"
download_page_image places brood_hive "Brood Hive" "$volume8_art"
download_page_image places nation_of_disorder "Nation of Disorder" "$volume8_art"
download_page_image places knowledge_moor "Knowledge Moor" "$volume8_art"
download_page_image places key_of_light "Key of Light" "$volume8_art"
download_page_image places tenebrous_world "Tenebrous World" "$volume8_art"

echo "Downloaded and converted Volume 4-8 images."
