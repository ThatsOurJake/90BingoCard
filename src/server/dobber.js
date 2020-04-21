import rng from './rng';

export default () => {
  const colours = ['#fab1a0', '#a29bfe', '#81ecec', '#fd79a8'];
  const index = rng(0, colours.length - 1);
  return colours[index];
};
