/**
 * Generate permanent 160px-wide inline WebP Music backgrounds.
 * Run from the repository root: node scripts/optimize-music-images.mjs
 * No flags. Requires cwebp on PATH (Homebrew package: webp).
 * Preserves originals and ICC profiles; updates only the four inline photos in
 * music.html, retaining each tile's configured crop ratio and position.
 */
import {execFile} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const encode=promisify(execFile);
const directory=fileURLToPath(new URL('../docs/assets/music_pictures/',import.meta.url));
const photos=[
    'ApophisDJSet.JPG',
    'ApophisDJSet_People.png',
    'PILiveAcousticSesh.jpg',
    'Studio.png'
];

const musicPage=fileURLToPath(new URL('../docs/music.html',import.meta.url));
const previews=await Promise.all(photos.map(async file=>{
    const {stdout}=await encode('cwebp',['-preset','photo','-q','35','-m','6','-metadata','icc','-resize','160','0',path.join(directory,file),'-o','-'],{encoding:'buffer'});
    console.log(`${file} inline photo: ${stdout.length} bytes`);
    return {name:path.parse(file).name,data:stdout.toString('base64')};
}));
const html=previews.reduce((page,{name,data})=>{
    const photo=new RegExp(`(data-music-preview="${name}" style="[^"]*--music-preview: url\\(')[^']+('\\)[^"]*")`);
    assert(photo.test(page),`Missing inline photo for ${name}`);
    return page.replace(photo,`$1data:image/webp;base64,${data}$2`);
},await readFile(musicPage,'utf8'));
await writeFile(musicPage,html);
