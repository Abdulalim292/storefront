import fs from 'fs';
import path from 'path';
import axios from 'axios';

// We can't easily import TS files into a vanilla Node script without ts-node
// So we will read the files as text and use a simple regex to extract the URLs
// or just use the files from the public folder if we can.
// Better yet: I'll just write a script that reads the .ts files as text.

async function downloadImage(url, filename) {
  const filePath = path.join(process.cwd(), 'public', 'images', 'products', filename);

  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${filename}, already exists.`);
    return;
  }

  try {
    console.log(`Downloading ${url}...`);
    const response = await axios({
      url,
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Failed to download ${url}: ${error.message}`);
  }
}

async function main() {
  const equipmentFile = path.join(process.cwd(), 'data', 'equipment.ts');
  const productsFile = path.join(process.cwd(), 'data', 'products.ts');

  const equipmentContent = fs.readFileSync(equipmentFile, 'utf8');
  const productsContent = fs.readFileSync(productsFile, 'utf8');

  // Regex to find all URLs in the files
  const urlRegex = /https?:\/\/[^'\s"\]\),]+/g;
  const allUrls = [...new Set([...equipmentContent.matchAll(urlRegex), ...productsContent.matchAll(urlRegex)])]
    .map(match => match[0])
    .filter(url => url.match(/\.(jpg|jpeg|png|webp|gif)$/i));

  console.log(`Found ${allUrls.length} unique images to download.`);

  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    const ext = path.extname(url).toLowerCase() || '.jpg';
    const filename = `image-${i + 1}${ext}`;
    await downloadImage(url, filename);
  }

  console.log('\\nDone! Images downloaded to public/images/products.');
}

main().catch(console.error);
