const { Position } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');

module.exports = {
    addPos: async (req, res)=> {
        try{
          const { name, subFields } = req.body;
          const position = await Position.findOne({where : { name : name }});
          if(position !== null){
               await position.update({subFields : subFields});
          }
          else {
            await Position.create({name: name, subFields : subFields, id : uuid()});
          }
          res.status(200).json({message: "Successfully Added Your Position."});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to add positions!" });
        }
      },
    updatePos: async (req, res)=> {
        try{
          const { subFields } = req.body;
          const { id } = req.params;
          let pos = await Position.findOne({id});
          pos.update({subFields});
          res.status(200).json({message: "Successfully Added Your Position."});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to add positions!" });
        }
      },
    getPositions: async (req, res)=> {
        try{
          const positions = await Position.findAll();
          res.status(200).json({message: "Successfully Fetched All Positions.", positions});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
      },
    deletePos: async (req, res)=>{
        try {
          const { id } = req.params;
          let pos = await Position.findOne({id});
          pos.destroy();
          res.status(200).json({message: "Successfully removed position with id:" + id});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!" });
        }
      }
}