const encoder = require("../Methods/encoder");
const urls = require("../models/urls.models");
const validator = require("validator");
const mongoose = require("mongoose");
const crypto = require("crypto");

module.exports = async (req, res) => {
  try {
    let { lurl, CC } = req.body || {};

    if (!lurl || typeof lurl !== "string") {
      return res.status(400).json({ warning: "No URL provided" });
    }

    if (!lurl.startsWith("http://") && !lurl.startsWith("https://")) {
      lurl = `https://${lurl}`;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    if (!validator.isURL(lurl)) {
      return res.status(400).json({ warning: "Invalid URL" });
    }

    const existingByUrl = await urls.findOne({ url: lurl });
    if (existingByUrl && existingByUrl.shortUrl) {
      return res.json({ u: `${baseUrl}/${existingByUrl.shortUrl}` });
    }

    if (CC && typeof CC === "string" && CC.trim() !== "") {
      CC = CC.trim();
      const validCustom = /^[A-Za-z0-9_-]{3,30}$/.test(CC);
      if (!validCustom) {
        return res.status(400).json({ warning: "Invalid custom code format" });
      }

      const conflict = await urls.findOne({ shortUrl: CC });
      if (conflict) {
        return res.status(400).json({ warning: "Custom Code already taken." });
      }

      const newCustom = new urls({ url: lurl, shortUrl: CC });
      await newCustom.save();
      return res.status(200).json({ u: `${baseUrl}/${CC}` });
    }

    const objectId = new mongoose.Types.ObjectId();
    const hex = objectId.toString();

    let chosenCode = null;
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const saltedHex = (BigInt("0x" + hex) + BigInt(attempt)).toString(16);
      const code = encoder(saltedHex);
      const conflict = await urls.findOne({ shortUrl: code });
      if (!conflict) {
        chosenCode = code;
        break;
      }
      if (conflict.url === lurl) {
        return res.json({ u: `${baseUrl}/${conflict.shortUrl}` });
      }
    }

    if (!chosenCode) {
      const randHex = crypto.randomBytes(12).toString("hex");
      const randCode = encoder(randHex);
      const conflict2 = await urls.findOne({ shortUrl: randCode });
      if (conflict2) {
        return res.status(500).json({ warning: "Failed to generate unique short URL" });
      }
      chosenCode = randCode;
    }

    const doc = new urls({ _id: objectId, url: lurl, shortUrl: chosenCode });
    await doc.save();
    return res.json({ u: `${baseUrl}/${chosenCode}` });
  } catch (err) {
    console.error("Error creating short URL:", err);
    if (err && err.code === 11000) {
      return res.status(409).json({ warning: "Duplicate entry" });
    }
    return res.status(500).json({ warning: "Server error" });
  }
};
