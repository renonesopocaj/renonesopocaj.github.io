/**
 * Generate 640px-wide inline Music backgrounds and optional responsive copies.
 * Run from the repository root: node scripts/optimize-music-images.mjs
 * No flags. Requires cwebp on PATH (Homebrew package: webp).
 * Preserves originals and ICC profiles; updates the four inline photos in
 * music.html and the files in music_pictures/optimized/. Retains configured crops.
 * Responsive copies remain available while their runtime loading is disabled.
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
const previews=await Promise.all(photos.map(async ({file,widths})=>{
    await Promise.all(widths.map(async width=>{
        const output=path.join(destination,`${path.parse(file).name}-${width}.webp`);
        await encode('cwebp',['-preset','photo','-q','75','-m','6','-mt','-metadata','icc','-resize',String(width),'0',path.join(directory,file),'-o',output]);
        console.log(`${path.basename(output)}: ${((await stat(output)).size/1024).toFixed(1)} KiB`);
    }));
    const {stdout}=await encode('cwebp',['-preset','photo','-q','55','-m','6','-metadata','icc','-resize','640','0',path.join(directory,file),'-o','-'],{encoding:'buffer'});
    console.log(`${file} inline photo: ${stdout.length} bytes`);
    return {name:path.parse(file).name,data:stdout.toString('base64')};
}));
const html=previews.reduce((page,{name,data})=>{
    const photo=new RegExp(`(data-music-preview="${name}" style="[^"]*--music-preview: url\\(')[^']+('\\)[^"]*")`);
    assert(photo.test(page),`Missing inline photo for ${name}`);
    return page.replace(photo,`$1data:image/webp;base64,${data}$2`);
},await readFile(musicPage,'utf8'));
await writeFile(musicPage,html);
