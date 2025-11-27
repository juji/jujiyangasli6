#!/usr/bin/env node

/**
 * PDF Generator for CV
 *
 * This script uses Puppeteer to generate a PDF from the CV page of jujiyangasli.com
 * It sets a specific width (774px) and outputs the PDF to the public directory
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

// Configuration
const URL = "http://localhost:3000/cv3";
// const URL = 'https://clerk.com/pricing';
const PDF_WIDTH = 797; // Width in pixels
const OUTPUT_PATH = path.join(__dirname, "..", "public", "juji-cv.pdf");

async function generatePDF() {
  console.log("Launching browser...");

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({
    width: PDF_WIDTH,
    height: 10000, // This will be adjusted by Puppeteer based on content
  });

  await page.goto(URL, {
    waitUntil: "networkidle2",
  });

  let height = await page.evaluate(() => document.documentElement.offsetHeight);

  // Saves the PDF to hn.pdf.
  await page.pdf({
    path: OUTPUT_PATH,
    printBackground: true,
    width: PDF_WIDTH,
    margin: "none",
    height: height + "px",
  });

  await browser.close();

  console.log(`PDF generated at ${OUTPUT_PATH}`);
}

generatePDF().catch(console.error);
