#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

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

# Characters
download_webp characters derrick_berg "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b1/Derrick_Berg_Official.jpg/revision/latest?cb=20210306083829"
download_webp characters emlyn_white "https://static.wikia.nocookie.net/lord-of-the-mystery/images/3/3a/Emlyn_White_Official.jpg/revision/latest?cb=20210305021444"
download_webp characters fors_wall "https://static.wikia.nocookie.net/lord-of-the-mystery/images/0/0e/Fors_Wall_Official.jpg/revision/latest?cb=20210306083856"
download_webp characters ian_wright "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/69/THvol10.jpg/revision/latest?cb=20210501101505"
download_webp characters maric "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/60/ThVol13.jpg/revision/latest?cb=20210609123523"
download_webp characters old_kohler "https://static.wikia.nocookie.net/lord-of-the-mystery/images/5/54/OldKohler.jpg/revision/latest?cb=20220627081751"
download_webp characters sharron "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/74/Sharron_Cropped_Official.jpg/revision/latest?cb=20210718104946"
download_webp characters xio_derecha "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/4d/Xio_Derecha_Official.jpg/revision/latest?cb=20210306083601"
download_webp characters ikanser_bernard "https://static.wikia.nocookie.net/lord-of-the-mystery/images/0/01/THvol18.jpg/revision/latest?cb=20211013073629"
download_webp characters isengard_stanton "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e0/THvol17.jpg/revision/latest?cb=20211004081815"
download_webp characters utravsky "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/7f/THvol14.jpg/revision/latest?cb=20210713133243"
download_webp characters will_auceptin "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/6f/COI_volTH18.png/revision/latest?cb=20250924115341"
download_webp characters lanevus "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c4/EP_12_-_Lanevus_%28cropped%29.jpeg/revision/latest?cb=20250914084013"
download_webp characters rosago "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c4/Fool_Official_Art.jpg/revision/latest?cb=20210306203923"
download_webp characters danitz "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f4/Danitz_Official.jpg/revision/latest?cb=20220507115025"
download_webp characters edwina_edwards "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/9d/Edwina_Edwards_Official.jpg/revision/latest?cb=20210501070721"
download_webp characters cattleya "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/69/Cattleya_Official.jpg/revision/latest?cb=20210305021126"
download_webp characters frank_lee "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b2/Thvol26.jpg/revision/latest?cb=20220420050211"
download_webp characters anderson_hood "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/70/THvol27.jpg/revision/latest?cb=20220507120638"
download_webp characters reinette_tinekerr "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/67/Reinette_Tinekerr_Official.jpg/revision/latest?cb=20221010141112"
download_webp characters darkwill "https://static.wikia.nocookie.net/lord-of-the-mystery/images/5/5f/Darkwill_Manhua_2020.jpg/revision/latest?cb=20200630191904"
download_webp characters bernadette_gustav "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/65/Bernadette_Gustav_Official.jpg/revision/latest?cb=20210501070658"
download_webp characters senor "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f4/Taiwan_Light_Novel_Edition_LOTM_Volume_3_Traveler_-_Part_6_Senor_%28Cropped%29.jpg/revision/latest?cb=20250601134333"

# Pathways
download_webp pathways chained_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/78/Chained_Official_Art.jpg/revision/latest?cb=20210412173407"
download_webp pathways door_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/2/2a/Door_Official_Art.jpg/revision/latest?cb=20210306203859"
download_webp pathways hunter_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/77/Red_Priest_Official_Art.jpg/revision/latest?cb=20210331193432"
download_webp pathways justiciar_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e7/Justiciar_Official_Art.jpg/revision/latest?cb=20210404070506"
download_webp pathways moon_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/1/13/Moon_Official_Art.jpg/revision/latest?cb=20210324021029"
download_webp pathways mother_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/4f/Mother_Official_Art.jpg/revision/latest?cb=20210322065604"
download_webp pathways mystery_pryer_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/95/Hermit_Official_Art.jpg/revision/latest?cb=20210319151451"
download_webp pathways sun_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/95/Sun_Official_Art.jpg/revision/latest?cb=20210324021053"
download_webp pathways wheel_of_fortune_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/8/88/Wheel_of_Fortune_Official_Art.jpg/revision/latest?cb=20210404175602"

# Places
download_webp places backlund "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a0/Backlund_Official_-_Factories.jpg/revision/latest?cb=20211026040057"
download_webp places east_borough "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a0/Backlund_Official_-_Factories.jpg/revision/latest?cb=20211026040057"
download_webp places harvest_church "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/7f/THvol14.jpg/revision/latest?cb=20210713133243"
download_webp places city_of_silver "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f9/Forsaken_Land_of_the_Gods_Official.png/revision/latest?cb=20210821193210"
download_webp places bansy_harbor "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/46/Tianwen_Kadokawa_%22Tonight%2C_Gehrman_joins_the_hunt.%22.jpg/revision/latest?cb=20250610103719"
download_webp places bayam "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e0/Rorsted-Archipelago.jpg/revision/latest?cb=20240106122207"
download_webp places rorsted_archipelago "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e0/Rorsted-Archipelago.jpg/revision/latest?cb=20240106122207"
download_webp places oravi_island "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e0/Rorsted-Archipelago.jpg/revision/latest?cb=20240106122207"
download_webp places sea_of_ruins "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/cb/The_Future_wooden_ship.png/revision/latest?cb=20240222134641"

# Organizations and deities
download_webp organizations machinery_hivemind "https://static.wikia.nocookie.net/lord-of-the-mystery/images/2/2d/God_of_Steam_and_Machinery_Emblem.jpg/revision/latest?cb=20210107071652"
download_webp organizations mi9 "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/ff/Loen-map.jpg/revision/latest?cb=20191110084805"
download_webp organizations abraham_family "https://static.wikia.nocookie.net/lord-of-the-mystery/images/2/2a/Door_Official_Art.jpg/revision/latest?cb=20210306203859"
download_webp organizations psychology_alchemists "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b0/Visionary_Official_Art.jpg/revision/latest?cb=20210306203953"
download_webp organizations rose_school_of_thought "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/78/Chained_Official_Art.jpg/revision/latest?cb=20210412173407"
download_webp organizations sanguines "https://static.wikia.nocookie.net/lord-of-the-mystery/images/1/13/Moon_Official_Art.jpg/revision/latest?cb=20210324021029"
download_webp organizations church_of_the_lord_of_storms "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/93/Lord_of_Storms_Emblem.jpg/revision/latest?cb=20210312052502"
download_webp organizations golden_dream_pirates "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/9d/Edwina_Edwards_Official.jpg/revision/latest?cb=20210501070721"
download_webp organizations resistance "https://static.wikia.nocookie.net/lord-of-the-mystery/images/8/89/Sea_God_Scepter.png/revision/latest?cb=20240301020120"
download_webp organizations stars_pirates "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/cb/The_Future_wooden_ship.png/revision/latest?cb=20240222134641"
download_webp gods lord_of_storms "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/ba/PM_Lord_of_Storms.png/revision/latest?cb=20250412091748"
download_webp gods mother_tree_of_desire "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/43/Mother_Tree_of_Desire_Official_Art.jpg/revision/latest?cb=20230621105116"
download_webp gods sea_god_kalvetua "https://static.wikia.nocookie.net/lord-of-the-mystery/images/8/89/Sea_God_Scepter.png/revision/latest?cb=20240301020120"

# Artifacts
download_webp sealed_artifacts arrodes "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/be/OC09_%22Magic_Mirror%22_Arrodes.png/revision/latest?cb=20250412114604"
download_webp sealed_artifacts black_emperor_card "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/42/Black_Emperor_Official_Art.jpg/revision/latest?cb=20210413193208"
download_webp sealed_artifacts biological_poison_bottle "https://static.wikia.nocookie.net/lord-of-the-mystery/images/1/12/HK-Biological_Poison_Bottle.jpg/revision/latest?cb=20251001132332"
download_webp sealed_artifacts master_key "https://static.wikia.nocookie.net/lord-of-the-mystery/images/3/3f/HK-Master_Key.jpg/revision/latest?cb=20251001132343"
download_webp sealed_artifacts allblack_eye "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c4/Fool_Official_Art.jpg/revision/latest?cb=20210306203923"
download_webp sealed_artifacts creeping_hunger "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a3/OC01_Creeping_Hunger.png/revision/latest?cb=20250412114549"
download_webp sealed_artifacts sea_god_scepter "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a6/OC10_Sea_God_Scepter.png/revision/latest?cb=20250412095218"
download_webp sealed_artifacts die_of_probability "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/bf/Wheel_of_Fortune_A5.jpg/revision/latest?cb=20231007154835"
download_webp sealed_artifacts groselles_travels "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/ff/Nine_of_Cups.jpeg/revision/latest?cb=20230912001149"
download_webp sealed_artifacts leymanos_travels "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c2/OC02_Leymano%27s_Travels.png/revision/latest?cb=20250412114550"

echo "Downloaded and converted Volume 2 and 3 images."
