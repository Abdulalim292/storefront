// A generated entry is marked by an empty source URL; no schema change needed.
export const ILLUSTRATIVE_NOTE =
  'Illustrative image; confirm the part against your engine or gearbox model.';

export function isGeneratedImage(product: { imageSourceUrl: string }): boolean {
  return product.imageSourceUrl === '';
}

export function showIllustrativeNote(
  product: { imageSourceUrl: string; images: string[] },
  renderedSrc: string,
): boolean {
  return isGeneratedImage(product) && renderedSrc === product.images[0];
}
