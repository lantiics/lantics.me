const express = require("express");
const req = require("express/lib/request");
const mariadb = require("mariadb");
const morgan = require("morgan");
require("dotenv").config({ path: [".env.local"] });
// const axios = require("axios");
const router = express();
router.use(express.json());
router.set('trust proxy', true)

/* START routing */

/* POST guestbook entry */

router.post("/guestbook/submit-entry", async (req, res) => {
  try {
    await addEntry(req.body, "not implemented");
    res.status(201).send(req.body);
  } catch (error) {
    console.error("Error adding entry:", error);
    res.status(500).send("Error adding entry:", error);
  }
});

router.get("/guestbook/get-entries", async (req, res) => {
  if ((await getEntryCount()) != 0) {
    var entries = await getEntries();
    res.json(entries);
  } else {
    res.json({
      meow: {
        name: "wow that's awful peculiar isn't it",
        content: "there aren't any entries in this here guestbook.. yet?",
      },
    });
  }
});

module.exports = router;
/* END routing */
const pool = mariadb.createPool({
  host: "localhost",
  user: `${process.env.MARIADB_GUESTBOOK_USER}`,
  password: `${process.env.MARIADB_GUESTBOOK_PASSWORD}`,
  database: "lantics_me",
  
});
/* START entry logic */
async function addEntry(entryJsonData, ip) {
  let name = entryJsonData.name;
  let content = entryJsonData.content;
  let entryId = (await getEntryCount()) + 1;
  if (content.slice("").length <= 1000 && name.slice("").length <= 50) {
    console.log(content.slice("").length, name.slice("").length);
    await pool.query(
      `INSERT INTO guestbook (name, content, entryId, ip, hidden) VALUES (?, ?, ?, ?, ?)`,
      [name, content, entryId, ip, false]
    );
  } else {
    console.log("string too long");
  }
}

async function getEntryCount() {
  try {
    let [rows] = await pool.query(
      "SELECT * FROM guestbook ORDER BY entryId DESC LIMIT 1"
    );
    // console.log()
    num = rows.entryId;
    console.log(parseInt(num));
    return await parseInt(num);
  } catch {
    return 0;
  }
}
getEntryCount();
async function getEntries() {
  let entryList = {};

  const entries = await pool.query("SELECT * FROM guestbook");
  entries.forEach((entry) => {
    if(entry.hidden!=1){entryList[entry.entryId] = { name: entry.name, content: entry.content };}
  });

  // let entryListObj = JSON.parse(entryList);
  // console.log(entries)
  // entryList=JSON.stringify(entryListObj)
  console.log(entryList);
  return entryList;
}
getEntries();
/* END entry logic */

// async function rawr(){console.log(await getEntryCount())}
// rawr()
