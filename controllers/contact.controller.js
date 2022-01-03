const { ContactUs } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');

module.exports = {
    addContact : async (req, res) => {
        try {
          const contact_details = req.body;
          await ContactUs.create({...contact_details, id : uuid()});
          res.status(200).json({message: "Successful Added Your Contact Details", contact_details});
        }
        catch (err) {
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
    },
    getContacts : async (req, res) => {
        try {
            const contacts = await ContactUs.findAll();
            res.status(200).json({message: "Successful Fetched Your Contact Details", contacts});
          }
          catch (err) {
            res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
          }
    },
    archiveContact : async (req, res) => {
      try {
        const { id } = req.params;
        const member = await (await ContactUs.findOne({where : {id : id}})).update({archived : req.body.archived});
        res.status(200).json({message: "Successful Archived Member", member});
      }
      catch (err) {
        res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
      }
    }
}