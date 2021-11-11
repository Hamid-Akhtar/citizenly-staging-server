
const { OcdTemplate } = require("../models/index");

module.exports = {
    getOcds : async (req, res) => {
        try {
          const ocds = await OcdTemplate.findAll();
          res.status(200).json({message: "Successful Fetched Ocd Templates", ocds});
        }
        catch (err) {
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
    }
}