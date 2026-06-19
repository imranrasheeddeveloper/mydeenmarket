#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_DIR="${1:-$ROOT_DIR/public/uploads/hero/source}"
OUT_DIR="$ROOT_DIR/public/uploads/hero"

if ! command -v magick >/dev/null 2>&1; then
  echo "Error: ImageMagick (magick) is required."
  exit 1
fi

mkdir -p "$OUT_DIR" "$SRC_DIR"

if [[ ! -f "$SRC_DIR/IMG_4067.HEIC" || ! -f "$SRC_DIR/IMG_4068.HEIC" || ! -f "$SRC_DIR/IMG_4072.HEIC" ]]; then
  echo "Place these files in $SRC_DIR first:"
  echo "  IMG_4067.HEIC"
  echo "  IMG_4068.HEIC"
  echo "  IMG_4072.HEIC"
  exit 1
fi

generate_hero() {
  local input_file="$1"
  local output_file="$2"

  magick "$input_file" \
    -auto-orient \
    -resize 1920x1080^ \
    -gravity center \
    -crop 1920x1080+0+0 +repage \
    -modulate 102,104,100 \
    -sigmoidal-contrast 3x50% \
    -unsharp 0x0.9+0.8+0.03 \
    -strip -quality 86 \
    "$output_file"
}

generate_hero "$SRC_DIR/IMG_4067.HEIC" "$OUT_DIR/hero-1.webp"
generate_hero "$SRC_DIR/IMG_4068.HEIC" "$OUT_DIR/hero-2.webp"
generate_hero "$SRC_DIR/IMG_4072.HEIC" "$OUT_DIR/hero-3.webp"

echo "Done: generated hero images in $OUT_DIR"
