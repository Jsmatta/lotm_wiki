#!/usr/bin/env bash

set -euo pipefail

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

download_webp() {
  local category="$1"
  local filename="$2"
  local url="$3"
  local source_file="$tmp_dir/$filename"
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

download_webp characters klein_moretti "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/4c/Klein_Moretti_Official.jpg/revision/latest?cb=20201017102316"
download_webp characters dunn_smith "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a6/Dunn_Smith_Official.jpg/revision/latest?cb=20210607112115"
download_webp characters leonard_mitchell "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/cc/Leonard_Mitchell_Official.jpg/revision/latest?cb=20210305021609"
download_webp characters old_neil "https://static.wikia.nocookie.net/lord-of-the-mystery/images/d/de/Old_Neil_Character_File.jpg/revision/latest?cb=20250607020438"
download_webp characters audrey_hall "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/ad/Audrey_Hall_Official.jpg/revision/latest?cb=20210306083654"
download_webp characters alger_wilson "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/63/Alger_Wilson_Official.jpg/revision/latest?cb=20210306083726"
download_webp characters melissa_moretti "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/44/EP_2_-_Melissa_%28cropped%29.jpg/revision/latest?cb=20250711121258"
download_webp characters benson_moretti "https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/99/EP_2_-_Benson_%28cropped%29.jpg/revision/latest?cb=20250711121256"
download_webp characters azik_eggers "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a7/Official-Azik-crop.jpg/revision/latest?cb=20201227045809"

download_webp pathways seer_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/c4/Fool_Official_Art.jpg/revision/latest?cb=20210306203923"
download_webp pathways sleepless_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/d/da/Darkness_Official_Art.jpg/revision/latest?cb=20210315030826"
download_webp pathways spectator_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b0/Visionary_Official_Art.jpg/revision/latest?cb=20210306203953"
download_webp pathways sailor_pathway "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a4/Tyrant_Official_Art.jpg/revision/latest?cb=20210312043221"

download_webp places tingen_city "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f7/Tingen_City_Official_2.jpg/revision/latest?cb=20210813105730"
download_webp places mysterious_space_above_the_gray_fog "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a0/PathsoftheDivine_SefirahCastle.png/revision/latest?cb=20221109173553"
download_webp places chanis_gate "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/ce/EP_2_-_Chanis_Gate_%282%29.jpg/revision/latest?cb=20250711120959"

download_webp organizations nighthawks "https://static.wikia.nocookie.net/lord-of-the-mystery/images/0/0f/Kleins_Nighthawks_contract_game.png/revision/latest?cb=20260524154321"
download_webp organizations blackthorn_security_company "https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/48/EP_2_-_Blackthorn_sign.jpg/revision/latest?cb=20250711133002"
download_webp organizations tarot_club "https://static.wikia.nocookie.net/lord-of-the-mystery/images/8/88/The_World.jpeg/revision/latest?cb=20230911232245"
download_webp organizations church_of_the_evernight_goddess "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/fc/Evernight_Goddess_Emblem.jpg/revision/latest?cb=20200330060956"

download_webp gods evernight_goddess "https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a6/PM_Evernight_Goddess.png/revision/latest?cb=20250412091741"
download_webp gods true_creator "https://static.wikia.nocookie.net/lord-of-the-mystery/images/3/3c/True_Creator_Official.jpg/revision/latest?cb=20210501071011"

download_webp spells luck_enhancement_ritual "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b5/EP_1_-_Divination_and_Arcane_Arts_of_the_Qin_and_Han_Dynasty.png/revision/latest?cb=20250710153425"
download_webp spells spirit_vision "https://static.wikia.nocookie.net/lord-of-the-mystery/images/6/6f/EP_2_-_Spirit_Vision_Old_Neil.jpg/revision/latest?cb=20250711121148"
download_webp spells dream_divination "https://static.wikia.nocookie.net/lord-of-the-mystery/images/1/14/EP_4_-_Tingen_Divination_Club.jpg/revision/latest?cb=20250712130836"

download_webp sealed_artifacts antigonus_familys_notebook "https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/77/EP_3_-_Antigonus_Family%27s_Notebook_%28cropped%29.jpg/revision/latest?cb=20250712074510"
download_webp sealed_artifacts saint_selenas_ashes "https://static.wikia.nocookie.net/lord-of-the-mystery/images/e/e7/EP_13_-_Saint_Selena%27s_Ashes_%282%29.jpeg/revision/latest?cb=20250914084510"
download_webp sealed_artifacts sealed_artifact_2049 "https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b0/EP_3_-_2-049_%28cropped%29.jpg/revision/latest?cb=20250712074508"
download_webp sealed_artifacts spirit_mediums_mirror "https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/fb/HK-Spirit_Medium%27s_Mirror.jpg/revision/latest?cb=20231022065453"

echo "Downloaded and converted 29 Volume 1 images."
