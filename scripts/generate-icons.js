import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const svgBuffer = fs.readFileSync('public/nandu-logo.svg');

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('Generated public/pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('Generated public/pwa-512x512.png');

  // 512x512 maskable PNG (padded with #0C2B54 background)
  const innerSize = Math.round(512 * 0.78);
  const innerBuffer = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 12, g: 43, b: 84, alpha: 1 }, // #0C2B54
    },
  })
    .composite([
      {
        input: innerBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('Generated public/pwa-maskable-512x512.png');

  // 180x180 Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('Generated public/apple-touch-icon.png');

  // 64x64 favicon PNG / ICO
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile('public/favicon.ico');
  console.log('Generated public/favicon.ico');

  // 32x32 favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile('public/favicon-32x32.png');
  console.log('Generated public/favicon-32x32.png');

  // Ensure icon.svg is synced with nandu-logo.svg
  fs.copyFileSync('public/nandu-logo.svg', 'public/icon.svg');
  console.log('Copied nandu-logo.svg to icon.svg');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
