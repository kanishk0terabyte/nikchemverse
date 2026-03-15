const express = require("express");
const Busboy = require("busboy");
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const db = require("../db");

const router = express.Router();

router.post("/upload", (req, res) => {

  const busboy = Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, info) => {

    const filename = info.filename;
    const compressedName = "compressed-" + filename + ".gz";

    const filepath = path.join(__dirname, "../uploads/", compressedName);

    const gzip = zlib.createGzip();
    const writeStream = fs.createWriteStream(filepath);

    file.pipe(gzip).pipe(writeStream);

    writeStream.on("finish", () => {

      const stats = fs.statSync(filepath);
      const size = stats.size;

      const sql = "INSERT INTO files (filename, filepath, size) VALUES (?, ?, ?)";

      db.query(sql, [filename, filepath, size], (err, result) => {
        if (err) {
          console.log("DB Error:", err);
        } else {
          console.log("Inserted into database");
        }
      });

    });

  });

  busboy.on("finish", () => {
    res.send("File uploaded and stored in database");
  });

  req.pipe(busboy);

});

module.exports = router;