import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const POKEDEX_URL =
  'https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json';
const OUT_PATH = resolve(process.cwd(), 'public/data/pokedex.backup.json');

async function main() {
  console.log('Downloading full Pokédex JSON...');
  const resp = await fetch(POKEDEX_URL, { cache: 'no-store' });
  if (!resp.ok) {
    throw new Error(`Failed to download: ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();

  // Ensure predictable order to maximize gzip efficiency and match app expectations
  const sorted = Array.isArray(data)
    ? data.sort((a, b) => a.dexNr - b.dexNr)
    : data;
  const json = JSON.stringify(sorted);

  console.log(
    `Original size: ${(new Blob([json]).size / (1024 * 1024)).toFixed(2)} MB`
  );

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, json);

  console.log(
    `Wrote ${OUT_PATH} (${(new Blob([json]).size / (1024 * 1024)).toFixed(
      2
    )} MB)`
  );
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
