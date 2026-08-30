#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_root"

if command -v sha256sum >/dev/null 2>&1; then
  if ! sha256sum -c dictionaries/CHECKSUMS.sha256 >/dev/null; then
    sha256sum -c dictionaries/CHECKSUMS.sha256
    exit 1
  fi
elif command -v shasum >/dev/null 2>&1; then
  if ! shasum -a 256 -c dictionaries/CHECKSUMS.sha256 >/dev/null; then
    shasum -a 256 -c dictionaries/CHECKSUMS.sha256
    exit 1
  fi
else
  echo "Потрібна команда sha256sum або shasum." >&2
  exit 1
fi

count=$(wc -l < dictionaries/CHECKSUMS.sha256 | tr -d " ")
echo "OK: перевірено $count файлів за SHA-256."
