const { EarlyMember } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');

module.exports = {
    addMember : async (req, res) => {
        try {
          const member = req.body;
          await EarlyMember.create({...member, id : uuid()});
          res.status(200).json({message: "Successful Added Member", member});
        }
        catch (err) {
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
    }
}