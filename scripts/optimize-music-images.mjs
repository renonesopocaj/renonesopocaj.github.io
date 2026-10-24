/**
 * Generate proportional WebP sizes for the four Music background photos.
 * Run from the repository root: node scripts/optimize-music-images.mjs
 * No flags. Requires cwebp on PATH (Homebrew package: webp).
 * Preserves originals/ICC profiles; writes to music_pictures/optimized/ and updates
 * music.html's four inline previews and shared preview/full-photo crop ratios.
 * Widths match music.html's srcset entries; Studio stops at its native 1254px width.
 */
import {execFile} from 'node:child_process';
import {mkdir,stat,readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {promisify} from 'node:util';

const encode=promisify(execFile);
const directory=fileURLToPath(new URL('../docs/assets/music_pictures/',import.meta.url));
const destination=path.join(directory,'optimized');
const photos=[
    {file:'ApophisDJSet.JPG',widths:[640,1280,1920]},
    {file:'ApophisDJSet_People.png',widths:[640,1280,1920]},
    {file:'PILiveAcousticSesh.jpg',widths:[640,1280,1920]},
    {file:'Studio.png',widths:[640,1254]}
];

await mkdir(destination,{recursive:true});
const musicPage=fileURLToPath(new URL('../docs/music.html',import.meta.url));
let html=await readFile(musicPage,'utf8');
for(const photo of photos){
    await Promise.all(photo.widths.map(async width=>{
        const output=path.join(destination,`${path.parse(photo.file).name}-${width}.webp`);
        await encode('cwebp',['-preset','photo','-q','75','-m','6','-mt','-metadata','icc','-resize',String(width),'0',path.join(directory,photo.file),'-o',output]);
        console.log(`${path.basename(output)}: ${((await stat(output)).size/1024).toFixed(1)} KiB`);
    }));
    const {stdout}=await encode('cwebp',['-preset','photo','-q','35','-m','6','-metadata','icc','-resize','160','0',path.join(directory,photo.file),'-o','-'],{encoding:'buffer'});
    const marker=`data-music-preview="${path.parse(photo.file).name}"`;
    const preview=new RegExp(`(${marker} style=")[^"]*(")`);
    assert(preview.test(html),`Missing preview tile for ${photo.file}`);
    const dimensions=html.match(new RegExp(`${marker}[\\s\\S]*?<img[^>]*\\bwidth="(\\d+)"[^>]*\\bheight="(\\d+)"`));
    assert(dimensions,`Missing full-photo dimensions for ${photo.file}`);
    const ratio=Number(dimensions[1])/Number(dimensions[2]);
    html=html.replace(preview,`$1--music-ratio: ${ratio}; --music-preview: url('data:image/webp;base64,${stdout.toString('base64')}')$2`);
    console.log(`${photo.file} inline preview: ${stdout.length} bytes`);
}
await writeFile(musicPage,html);
