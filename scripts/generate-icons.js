const sharp = require('sharp');
const path = require('path');

const svg = path.join(__dirname, '../public/icons/icon.svg');

async function generate() {
  await sharp(svg).resize(192, 192).png().toFile(path.join(__dirname, '../public/icons/icon-192.png'));
  await sharp(svg).resize(512, 512).png().toFile(path.join(__dirname, '../public/icons/icon-512.png'));
  await sharp(svg).resize(1200, 630).png().toFile(path.join(__dirname, '../public/preview.png'));
  console.log('Icons generated!');
}

generate().catch(console.error);
