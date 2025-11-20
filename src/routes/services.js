const express = require("express");
const req = require("express/lib/request");
const morgan = require("morgan");
require("dotenv").config({ path: [".env.local"] });
const router = express();
router.use(express.json());
router.set("trust proxy", true);
const production_status = process.env.PROD;
/* START routing */

/* END routing */

/* START mariadb required */

if (production_status === "TRUE") {
  const mariadb = require("mariadb");
  /* START mariadb routing */

  /* POST guestbook entry */

  router.post("/guestbook/submit-entry", async (req, res) => {
    try {
      await addEntry(req.body, getHash(req.ip));
      res.status(201).send(req.body);
    } catch (error) {
      console.error("Error adding entry:", error);
      res.status(500).send("Error adding entry:", error);
    }
  });

  /* GET guestbook entries */

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
  /* END mariadb routing */
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
        [name, content, entryId, ip, false],
      );
    } else {
      console.log("string too long");
    }
  }

  async function getEntryCount() {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM guestbook ORDER BY entryId DESC LIMIT 1",
      );

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
      if (entry.hidden != 1) {
        entryList[entry.entryId] = { name: entry.name, content: entry.content };
      }
    });

    console.log(entryList);
    return entryList;
  }
  getEntries();
}
/* END mariadb required */

/* END entry logic */

const { createHash } = require("node:crypto");
function getHash(str) {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
}

// async function rawr(){console.log(await getEntryCount())}
// rawr()
//
module.exports = router;
