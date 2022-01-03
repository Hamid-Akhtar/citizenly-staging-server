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
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
    },
    getMembers : async (req, res) => {
      try {
        const members = await EarlyMember.findAll();
        res.status(200).json({message: "Successful Fetched All Members", members});
      }
      catch (err) {
        console.log(err);
        res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
      }
    },
    archiveMember : async (req, res) => {
      try {
        const { id } = req.params;
        const member = await (await EarlyMember.findOne({where : {id : id}})).update({archived : req.body.archived});
        res.status(200).json({message: "Successful Archived Member", member});
      }
      catch (err) {
        res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
      }
    }
}