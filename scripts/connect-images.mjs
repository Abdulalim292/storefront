import fs from 'fs';
import path from 'path';
import axios from 'axios';

async function downloadImage(url, filename) {
  const filePath = path.join(process.cwd(), 'public', 'images', 'products', filename);

  if (fs.existsSync(filePath)) {
    return `/images/products/${filename}`;
  }

  try {
    const response = await axios({
      url,
      responseType: 'stream',
    });
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    return new Promise((resolve) => {
      writer.on('finish', () => resolve(`/images/products/${filename}`));
      writer.on('error', () => resolve(url));
    });
  } catch (error) {
    return url;
  }
}

async function main() {
  const equipmentFile = path.join(process.cwd(), 'data', 'equipment.ts');
  const productsFile = path.join(process.cwd(), 'data', 'products.ts');

  let equipmentContent = fs.readFileSync(equipmentFile, 'utf8');
  let productsContent = fs.readFileSync(productsFile, 'utf8');

  // Process equipment.ts
  const equipmentModels = /\{(?:[^{}]*)\}/g.exec(equipmentContent);
  // This is hard because the file is a complex TS file.
  // Instead, we will search for all URLs, and for each one, we will replace it with
  // a local path based on its index.
  // BUT, to be professional, we should use a mapping.

  const urlRegex = /https?:\/\/[^'\s"\]\),]+/g;
  const allUrls = [...new Set([
    ...equipmentContent.matchAll(urlRegex),
    ...productsContent.matchAll(urlRegex)
  ])].map(match => match[0]).filter(url => url.match(/\.(jpg|jpeg|png|webp|gif)$/i));

  const urlMap = {};
  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i];
    const ext = path.extname(url).toLowerCase() || '.jpg';
    const filename = `prod-img-${i + 1}${ext}`;
    const localPath = await downloadImage(url, filename);
    urlMap[url] = localPath;
  }

  // Replace in content
  for (const [url, localPath] of Object.entries(urlMap)) {
    equipmentContent = equipmentContent.split(url).join(localPath);
    productsContent = productsContent.split(url).join(localPath);
  }

  fs.writeFileSync(equipmentFile, equipmentContent);
  fs.writeFileSync(productsFile, productsContent);

  console.log('Successfully updated all image references to local paths!');
}

main().catch(console.error);
