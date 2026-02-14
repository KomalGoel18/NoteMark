const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (url) => {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);
    return $("title").text() || "Untitled";
  } catch {
    return "Untitled";
  }
};
