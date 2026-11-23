const fs = require('fs');
const path = require('path');
const url = require('url');
const { removeBackground } = require('@imgly/background-removal-node');

const sofas = [
  { name: 'antalia', title: 'Antalia', file: 'antalia.JPG' },
  { name: 'phantom', title: 'Phantom', file: 'phantom.JPG' },
  { name: 'miranda', title: 'Miranda', file: 'miranda.JPG' },
  { name: 'berlin', title: 'Berlin', file: 'berlin.JPG' },
  { name: 'arturo', title: 'Arturo', file: 'arturo.JPG' },
  { name: 'sierra', title: 'Sierra', file: 'sierra.JPG' }
];

async function run() {
  for (const s of sofas) {
    const inputPath = path.resolve(__dirname, 'Sofas', s.file);
    const outputPath = path.resolve(__dirname, 'Sofas', `${s.name}_no_bg.png`);

    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${s.name}, already exists.`);
      continue;
    }

    console.log(`Removing background for ${s.name} (${s.file})...`);
    const fileUrl = url.pathToFileURL(inputPath).href;

    try {
      const blob = await removeBackground(fileUrl, {
        output: {
          format: 'image/png',
          quality: 0.95
        }
      });

      const buffer = Buffer.from(await blob.arrayBuffer());
      fs.writeFileSync(outputPath, buffer);
      console.log(`Successfully saved ${outputPath} (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Failed to process ${s.name}:`, e);
    }
  }
  console.log('All sofa backgrounds removed!');
}

run();
