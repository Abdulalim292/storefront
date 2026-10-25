import { readCatalog, localImagePath, downloadImage } from './image-utils.mjs';

async function main() {
  const catalog = readCatalog();
  const images = catalog.products.flatMap((product) =>
    (product.images ?? [])
      .map((url, index) => ({ product, url, index }))
      .filter(({ url }) => /^https?:\/\//i.test(url)),
  );

  console.log(`Found ${images.length} remote catalog images.`);

  let downloaded = 0;
  let failed = 0;
  for (const { product, url, index } of images) {
    if (await downloadImage(url, localImagePath(product.id, index, url))) downloaded += 1;
    else failed += 1;
  }

  console.log(`\nDownloaded or already present: ${downloaded}`);
  if (failed) {
    console.error(`Failed: ${failed}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
