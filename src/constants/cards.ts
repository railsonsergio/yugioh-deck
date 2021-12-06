import { images } from './images';

export const cards = Object.values(images).map((imageSource, index) => ({
  source: imageSource,
  id: index,
}));
