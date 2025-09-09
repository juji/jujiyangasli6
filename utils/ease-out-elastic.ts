import { writeFile } from "fs";

function easeOutElastic(x: number) {
    const c4 = (2 * Math.PI) / 3;
    
    return x === 0
      ? 0
      : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}


const total = 10000
const increment = 100 / total

let str = 'linear(\n'
for(let i=0; i<=1;i+=increment){
  str += `    ${easeOutElastic(i)} ${ Math.round( i*10000 ) / 100 }%,\n`
}

str += `    1 100%
  )`
str = `:root {
  --rubbery: ${str};
}`

writeFile('ease-out-elastic.css', str, (err) => {
  if (err) {
    console.error('Error writing file:', err);
  } else {
    console.log('File written successfully!');
  }
});