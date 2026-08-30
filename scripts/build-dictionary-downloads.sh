#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$repo_root/dictionaries"

node ../scripts/build-dictionary-assets.mjs

rm -f \
  english/downloads/english-wordlists.zip \
  english/downloads/english-academy.zip \
  english/downloads/english-tutor.zip \
  english/downloads/english-knowledge.zip \
  english/downloads/english-all.zip \
  ukrainian/downloads/ukrainian-wordlists.zip \
  ukrainian/downloads/ukrainian-academy.zip \
  ukrainian/downloads/ukrainian-tutor.zip \
  ukrainian/downloads/ukrainian-knowledge.zip \
  ukrainian/downloads/ukrainian-texts.zip \
  ukrainian/downloads/ukrainian-all.zip

zip -q -r -X english/downloads/english-wordlists.zip english/wordlists
zip -q -r -X english/downloads/english-academy.zip english/academy
zip -q -r -X english/downloads/english-tutor.zip english/tutor
zip -q -r -X english/downloads/english-knowledge.zip english/knowledge
zip -q -r -X english/downloads/english-all.zip \
  english/README.md english/wordlists english/academy english/tutor english/knowledge english/reference

zip -q -r -X ukrainian/downloads/ukrainian-wordlists.zip ukrainian/wordlists
zip -q -r -X ukrainian/downloads/ukrainian-academy.zip ukrainian/academy
zip -q -r -X ukrainian/downloads/ukrainian-tutor.zip ukrainian/tutor
zip -q -r -X ukrainian/downloads/ukrainian-knowledge.zip ukrainian/knowledge
zip -q -r -X ukrainian/downloads/ukrainian-texts.zip ukrainian/texts
zip -q -r -X ukrainian/downloads/ukrainian-all.zip \
  ukrainian/README.md ukrainian/wordlists ukrainian/academy ukrainian/tutor ukrainian/knowledge ukrainian/texts ukrainian/reference

echo "OK: ZIP-пакети словників оновлено."
