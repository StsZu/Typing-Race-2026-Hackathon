#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_root"

checksum_file="dictionaries/CHECKSUMS.sha256"
temporary_file=$(mktemp)
trap 'rm -f "$temporary_file"' EXIT

find dictionaries -type f ! -path "$checksum_file" -print | LC_ALL=C sort | while IFS= read -r file; do
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$file"
  else
    shasum -a 256 "$file"
  fi
done > "$temporary_file"

mv "$temporary_file" "$checksum_file"
trap - EXIT

count=$(wc -l < "$checksum_file" | tr -d " ")
echo "OK: записано $count контрольних сум."
