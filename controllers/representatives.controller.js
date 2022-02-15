const { OcdTemplate } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');
const { SuggestedOfficial } = require("../models/suggested_official");

module.exports = {
    addRep : async (req, res) => {
        try {
          if(req.body.divisionId){
             const ocd = await OcdTemplate.findOne({where : {name : req.body.divisionId }});
             if(!ocd) await OcdTemplate.create({name : req.body.divisionId, id : uuid()});
          }

          const official = {
            ...req.body.official
          };
          const address = official.address[0];

          const officeTitle = req.body.office.name;
          const divisionId = req.body.divisionId;

          await SuggestedOfficial.create({
            id : uuid(), 
            name_of_official: official.name,
            office_title: officeTitle,
            non_partisan: official.nonPartisan,
            jurisdiction: official.jurisdiction,
            agency: official.agency,
            display_party_affiliation: official.displayPoliticalAssociation,
            political_association: official.party,
            phone_number: official.phones.length ? official.phones[0] : '',
            email_address:(official.emails && official.emails.length) ? official.emails[0] : '',
            address_line_1: address.line1,
            address_line_2:address.line2,
            city: address.city,
            state: address.state,
            zip_code: address.zip,
            website_url: (official.urls.length ? official.urls[0] : ''),
            photo_url: official.photoUrl,
            facebook_url: (official.channels.length && official.channels[0]) ? official.channels[0].id : '',
            twitter_url: (official.channels.length && official.channels[1]) ? official.channels[1].id : '',
            linked_in_url: (official.channels.length && official.channels[2]) ? official.channels[2].id : '',
            instagram_url: (official.channels.length && official.channels[3]) ? official.channels[3].id : '',
            jurisdiction: official.jurisdiction,
            agency: official.agency,
            division_id: divisionId
          });
/*
          await RepresentativeApplication.create({
            ...req.body, id : uuid(), 
            createdAt : new Date().toISOString().slice(0, 19).replace('T', ' '), 
            updatedAt : new Date().toISOString().slice(0, 19).replace('T', ' ')});
*/
          res.status(200).json({message: "Successful Submitted Your Application"});
        }
        catch (err) {
          console.log(err);
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
      },
    updateRep: async (req, res) => {
        try {
            const { id } = req.params;
            let rep = await SuggestedOfficial.findOne({where:{id: id}});
            if(rep) await rep.update({...req.body, updatedAt : new Date().toISOString().slice(0, 19).replace('T', ' ')});
            res.status(200).json({message: "Successful Updated Your Application"});
        }
        catch (err) {
            res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
    },
    getReps: async (req, res)=>{
        try {
          const { searchTerm, status } = req.query;
          let rep;
          let filterTerm = {};
      
          if(status) filterTerm['request_status'] = status;
          
          if(!searchTerm && !status) rep = await SuggestedOfficial.findAll();

          else{
            rep = await SuggestedOfficial.findAll({
              where:{
                 ...filterTerm
              }
            });
          }
          res.status(200).json({reps: rep});
        }
        catch (err) {
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
      },
    delRep: async (req, res)=>{
        try {
          const { id } = req.params;
          let rep = await SuggestedOfficial.findByPk(id);
          rep.destroy();
          res.status(200).json({message: "Successfully removed representative with id:" + id});
        }
        catch (err) {
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
      }
}