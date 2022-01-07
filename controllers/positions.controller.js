const { Position } = require("../models/index");
// unique ID's
const { uuid } = require('uuidv4');

module.exports = {
    /** Add New Position */
    addPos: async (req, res)=> {
        try{
          const { name, section, category } = req.body;
          const position = await Position.findOne({where : { name : name }});
          if(position !== null){
               await position.update({section : section, category : category});
          }
          else {
            await Position.create({name: name, section : section, category : category, id : uuid()});
          }
          res.status(200).json({message: "Successfully Added Your Position."});
        }
        catch (err) {
          res.status(500).json({ error: "Something went wrong, unable to add positions!" });
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
          res.status(500).json({ error: "Something went wrong, unable to add positions!" });
        }
      },
    getPositions: async (req, res)=> {
        try{
          const positions = await Position.findAll();
          res.status(200).json({message: "Successfully Fetched All Positions.", positions});
        }
        catch (err) {
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
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
          res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
        }
      }
}