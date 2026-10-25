import { readCatalog, writeCatalog, localImagePath, downloadImage } from './image-utils.mjs';

async function main() {
  const catalog = readCatalog();
  let localized = 0;
  let failed = 0;

  for (const product of catalog.products) {
    const images = product.images ?? [];
    for (let index = 0; index < images.length; index += 1) {
      const url = images[index];
      if (!/^https?:\/\//i.test(url)) continue;

      const localPath = localImagePath(product.id, index, url);
      if (await downloadImage(url, localPath)) {
        images[index] = localPath;
        localized += 1;
      } else {
        failed += 1;
      }
    }
  }

  if (localized > 0) {
    writeCatalog(catalog);
    console.log(`\nLocalized ${localized} image references in data/catalog.json.`);
  } else {
    console.log('\nNo remote images were localized; catalog unchanged.');
  }

  if (failed) {
    console.error(`Failed to download ${failed} image(s); those entries still use their remote URL.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
