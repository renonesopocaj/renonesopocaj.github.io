/**
 * Generate proportional WebP sizes for the four Music background photos.
 * Run from the repository root: node scripts/optimize-music-images.mjs
 * No flags. Requires cwebp on PATH (Homebrew package: webp).
 * Preserves the originals and ICC color profiles; writes to music_pictures/optimized/.
 * Widths match music.html's srcset entries; Studio stops at its native 1254px width.
 */
import {execFile} from 'node:child_process';
import {mkdir,stat} from 'node:fs/promises';
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
for(const photo of photos){
    await Promise.all(photo.widths.map(async width=>{
        const output=path.join(destination,`${path.parse(photo.file).name}-${width}.webp`);
        await encode('cwebp',['-preset','photo','-q','75','-m','6','-mt','-metadata','icc','-resize',String(width),'0',path.join(directory,photo.file),'-o',output]);
        console.log(`${path.basename(output)}: ${((await stat(output)).size/1024).toFixed(1)} KiB`);
    }));
}
