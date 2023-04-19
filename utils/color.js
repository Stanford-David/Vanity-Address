import colors from 'nice-color-palettes';
import random from 'lodash.random';

export const getRandomColors = () => {
  return colors[random(0, colors.length)];
};
