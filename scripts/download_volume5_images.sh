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

demoness_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a8/Demoness_Official_Art.jpg/revision/latest?cb=20210330072757"
black_emperor_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/4/42/Black_Emperor_Official_Art.jpg/revision/latest?cb=20210413193208"
sun_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/9/95/Sun_Official_Art.jpg/revision/latest?cb=20210324021053"
rose_school_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/7/78/Chained_Official_Art.jpg/revision/latest?cb=20210412173407"
backlund_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/a/a0/Backlund_Official_-_Factories.jpg/revision/latest?cb=20211026040057"
feysac_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/f/f2/PM_God_of_Combat.png/revision/latest?cb=20250412091744"
visionary_art="https://static.wikia.nocookie.net/lord-of-the-mystery/images/b/b0/Visionary_Official_Art.jpg/revision/latest?cb=20210306203953"

download_page_image characters trissy "Trissy" "$demoness_art"
download_page_image characters shermane "Shermane" "$demoness_art"
download_page_image characters stratford "Stratford" "$backlund_art"
download_page_image characters katarina_pelle "Katarina Pelle" "$demoness_art"
download_page_image characters ernes_boyar "Ernes Boyar" "$backlund_art"
download_page_image characters flora_jacob "Flora Jacob" "https://static.wikia.nocookie.net/lord-of-the-mystery/images/c/cb/Error_Official_Art.jpg/revision/latest?cb=20210306203818"
download_page_image characters nast_solomon "Nast Solomon" "$black_emperor_art"
download_page_image characters william_augustus_i "William Augustus I" "$black_emperor_art"
download_page_image characters suah "Suah" "$rose_school_art"
download_page_image characters hermes "Hermes" "$visionary_art"

download_page_image places feysac_empire "Feysac Empire" "$feysac_art"
download_page_image places abandoned_castle "Abandoned Castle" "$backlund_art"

download_page_image organizations loen_royal_family "Loen Royal Family" "$black_emperor_art"
download_page_image organizations temperance_faction "Temperance Faction" "$rose_school_art"

download_page_image sealed_artifacts mutated_sun_sacred_emblem "Mutated Sun Sacred Emblem" "$sun_art"
download_page_image spells george_iiis_apotheosis_ritual "George III's Apotheosis Ritual" "$black_emperor_art"

echo "Downloaded and converted Volume 5 images."
