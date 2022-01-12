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
              BIRTH_DATE : provided_details.birthYear, 
              HOUSE_NUM : provided_details.houseNo + ".0"
          }});
          if(voter) res.status(200).json({message: "Successful Fetched Voter Data", voter});
          else res.status(404).json({message: "Can't find any voter matching the provided details.", voter: null});
        }
        catch (err) {
          console.log(err);
          res.status(500).json({ error: "Something went wrong, unable to fetch results!", voter: null});
        }
    }
}