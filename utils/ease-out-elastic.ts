import { writeFile } from "fs";
import path from "path";

const total = 10000;

// get directory of this script
const dir = path.dirname(new URL(import.meta.url).pathname);

// const file = 'ease-out-elastic.css'
const file = path.join(dir, "../src/app/rubbery.css");

function easeOutElastic(x: number) {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

const increment = 100 / total;
let str = "linear(\n";
for (let i = 0; i <= 1; i += increment) {
  str += `    ${easeOutElastic(i)} ${Math.round(i * 10000) / 100}%,\n`;
}

str += `    1 100%
  )`;
str = `:root {
  --rubbery: ${str};
}`;

writeFile(file, str, (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("File written successfully!");
    console.log(file);
  }
});
