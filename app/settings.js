import jsonfile from "jsonfile";
import { logger } from "./config";

async function settings(user) {
  try {
    const date = new Date();
    date.setUTCHours(date.getUTCHours() + 1);
    const dom = date.getDate();
    const month = date.getMonth() + 1;
    const s = await jsonfile.readFile("../settings.json");
    let songs = {};
    if (user === "admin") {
      songs = s.songs;
    } else if (month === 12) {
      for (const [d, song] of Object.entries(s.songs)) {
        if (parseInt(d) <= dom) {
          songs[d] = song;
        }
      }
    }
    const template = `
var desktopBackgroundImage = "${s.desktopBackgroundImage}";
var mobileBackgroundImage = "${s.mobileBackgroundImage}";
var audioPrefix = "music/";
var songs = ${JSON.stringify(songs)};
`;
    return template;
  } catch (e) {
    logger.error(e);
    return "";
  }
}

export { settings as default };
