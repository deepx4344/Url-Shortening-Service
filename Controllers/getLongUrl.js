const urls = require("../models/urls.models");

module.exports = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send("Missing id");
    }

    const current = await urls.findOne({ shortUrl: id });
    if (current && current.url) {
      return res.redirect(current.url);
    }

    return res.status(404).send("<h1>Not Found</h1>");
  } catch (err) {
    console.error("Error resolving short URL:", err);
    return res.status(500).send("Internal Server Error");
  }
};
