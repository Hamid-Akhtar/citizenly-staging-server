const { Op } = require("sequelize");
const { Voter } = require("../models/index");

module.exports = {
    fetchVoterData : async (req, res) => {
        try {
          const provided_details = req.query;
          const voter = await Voter.findOne({where : {
              FIRST_NAME : {
                [Op.like] : `%${provided_details.firstName}%`
              },
              LAST_NAME : {
                [Op.like] : `%${provided_details.lastName}%`
              },
              RES_ADDRESS_1 : {
                [Op.like] : `%${provided_details.line1}%`
              },
              CITY : {
                [Op.like] : `%${provided_details.city}`
              },
              BIRTH_DATE : provided_details.birthYear, 
              ZIP_CODE : provided_details.zip
          }});
          if(voter) res.status(200).json({message: "Successful Fetched Voter Data", voter});
          else res.status(404).json({message: "Can't find any voter matching the provided details.", voter: null});
        }
        catch (err) {
          console.log(err);
          res.status(400).json({ error: "Something went wrong, unable to fetch results!", voter: null});
        }
    }
}