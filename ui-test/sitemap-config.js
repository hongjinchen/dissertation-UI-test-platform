const { SitemapStream } = require("sitemap");
const { createGzip } = require("zlib");
const { createWriteStream } = require("fs");
const { SitemapPreset } = require("react-router-sitemap");

const router = require("./src/routes").default;

const SITEMAP_OUTPUT_FILE = "./public/sitemap.xml";
const hostname = "http://localhost:3000";

const preset = new SitemapPreset(router, hostname);

preset
  .apply()
  .then((sm) => {
    const stream = new SitemapStream({ hostname });
    sm.pipe(stream);
    const fileStream = createWriteStream(SITEMAP_OUTPUT_FILE);
    const gzip = createGzip();
    stream.pipe(gzip).pipe(fileStream);
  })
  .catch((e) => {
    console.error(e);
  });
