#!/usr/bin/env node
const { writeFileSync } = require("fs");
const { spawnChrome } = require("chrome-debugging-client");

/**
 * Print a url to a PDF file.
 * @param url {string}
 * @param file {string}
 */
async function printToPDF(url, file) {
  const chrome = spawnChrome({ headless: true });
  try {
    const browser = chrome.connection;

    // we create with a target of about:blank so that we can
    // setup Page events before navigating to url
    const { targetId } = await browser.send("Target.createTarget", {
      url: "about:blank",
    });

    const page = await browser.attachToTarget(targetId);
    // enable events for Page domain
    await page.send("Page.enable");

    // concurrently wait until load and navigate
    await Promise.all([
      page.until("Page.loadEventFired"),
      page.send("Page.navigate", { url }),
    ]);

    const { data } = await page.send("Page.printToPDF");

    writeFileSync(file, data, "base64");

    // attempt graceful close
    await chrome.close();
  } finally {
    // kill process if hasn't exited
    await chrome.dispose();
  }

  console.log(`${url} written to ${file}`);
}

if (process.argv.length < 4) {
  console.log(`usage: printToPDF.js url file`);
  console.log(
    `example: printToPDF.js https://en.wikipedia.org/wiki/Binomial_coefficient Binomial_coefficient.pdf`,
  );
  process.exit(1);
}

printToPDF(process.argv[2], process.argv[3]);
