const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "..", "public", "images", "play");

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  const pngFiles = files.filter(
    (file) => path.extname(file).toLowerCase() === ".png",
  );

  if (pngFiles.length === 0) {
    console.log("No PNG files found in the directory.");
    return;
  }

  pngFiles.forEach((file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(
      inputDir,
      path.basename(file, ".png") + ".avif",
    );

    sharp(inputPath)
      .resize(600)
      .avif()
      .toFile(outputPath)
      .then(() =>
        console.log(`Converted ${file} to ${path.basename(outputPath)}`),
      )
      .catch((err) => console.error(`Error converting ${file}:`, err));
  });
});
