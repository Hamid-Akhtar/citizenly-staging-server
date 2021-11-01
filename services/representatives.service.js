
const { RepresentativeApplication, OcdTemplate } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');

module.exports = {
    addRep : async (req, res) => {
        try {
          if(req.body.divisionId){
             const ocd = await OcdTemplate.findOne({name : req.body.divisionId});
             if(ocd) await OcdTemplate.create({name : req.body.divisionId, id : uuid()});
          }
          await RepresentativeApplication.create({...req.body, id : uuid()});
          res.status(200).json({message: "Successful Submitted Your Application"});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
      },
    updateRep: async (req, res) => {
        try {
            const { id } = req.params;
            let rep = await RepresentativeApplication.findOne({where:{id: id}});
            if(rep) await rep.update({...req.body});
            res.status(200).json({message: "Successful Updated Your Application"});
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
    },
    getReps: async (req, res)=>{
        try {
          const { searchTerm, status } = req.query;
          let rep;
          let filterTerm = {};
      
          if(searchTerm) filterTerm['searchTerm'] = searchTerm;
          if(status) filterTerm['verified'] = parseInt(status);
          
          if(!searchTerm && !status) rep = await RepresentativeApplication.findAll();
          else{
            rep = await RepresentativeApplication.findAll({
              where:{
                 ...filterTerm
              }
            });
          }
          res.status(200).json({reps: rep});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
      },
    delRep: async (req, res)=>{
        try {
          const { id } = req.params;
          let rep = await RepresentativeApplication.findByPk(id);
          rep.destroy();
          res.status(200).json({message: "Successfully removed representative with id:" + id});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
      }
}