let colors = [
  // [196, 229, 56], // '#C4E538',
  // [18, 203, 196], // '#12CBC4',
  [237, 76, 103], // '#ED4C67',
  [163, 203, 56], // '#A3CB38',
  [238, 90, 36], // '#EE5A24',
  [0, 148, 50], // '#009432',
  [234, 32, 39], // '#EA2027',
  [6, 82, 221], // '#0652DD',
  [217, 128, 250], // '#D980FA',
  [153, 128, 250], // '#9980FA',
];

colors = [...colors, ...colors, ...colors];

export function randomColor(exclude: string[]) {
  const color = colors[Math.floor(Math.random() * colors.length)].join(",");
  if (exclude.includes(color)) return randomColor(exclude);
  return color;
}
