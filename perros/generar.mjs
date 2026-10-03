// Uso (Node 18+, con internet): node perros/generar.mjs
// Crea perros/<pais>/ con 10 fotos y enlaces.txt (URL de la página de cada foto).
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PAISES = ["Argentina","Brasil","Chile","Colombia","México","Perú","Uruguay","Paraguay","Bolivia","Ecuador"];
const slug = p => p.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const base = dirname(fileURLToPath(import.meta.url));
const API = "https://commons.wikimedia.org/w/api.php?";

for (const pais of PAISES) {
  const q = new URLSearchParams({
    action: "query", generator: "search", gsrsearch: `filetype:bitmap dog ${pais}`,
    gsrnamespace: 6, gsrlimit: 10, prop: "imageinfo", iiprop: "url", iiurlwidth: 800, format: "json",
  });
  const d = await (await fetch(API + q, { headers: { "User-Agent": "ascensor-game-perros/1.0" } })).json();
  const fotos = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
  const dir = join(base, slug(pais));
  await mkdir(dir, { recursive: true });
  const enlaces = [];
  for (const [i, p] of fotos.entries()) {
    const info = p.imageinfo[0];
    const nombre = `${String(i + 1).padStart(2, "0")}.jpg`;
    const img = await fetch(info.thumburl, { headers: { "User-Agent": "ascensor-game-perros/1.0" } });
    await writeFile(join(dir, nombre), Buffer.from(await img.arrayBuffer()));
    enlaces.push(`${nombre}\t${info.descriptionurl}`);
  }
  await writeFile(join(dir, "enlaces.txt"), enlaces.join("\n") + "\n");
  console.log(`${pais}: ${fotos.length} fotos`);
}
