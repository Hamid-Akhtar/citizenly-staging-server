const { default: axios } = require('axios');
const { RepresentativeApplication } = require("../models/index");
const { Op } = require('sequelize');
const { SuggestedOfficial } = require('../models/suggested_official');

module.exports = async (req, res) => {
    try {
      const { searchTerm } = req.query;
      const apiKey = process.env.CIVIC_KEY;
      const url = `${process.env.CIVIC_URL}=${apiKey}&address=${searchTerm.toLowerCase()}`;
      const responseFromCivic = await axios.get(url);
      let data = responseFromCivic.data;
      const keysOfDiv = Object.keys(data.divisions);
      const rep = await RepresentativeApplication.findAll({
        where: {
          divisionId: {
            [Op.in]: keysOfDiv
          },
          verified : 2 // This means only return `representatives` that are approved by admin
        }   
      });
      const repNew = await SuggestedOfficial.findAll({
        where: {
          division_id: {
            [Op.in]: keysOfDiv
          }
        }
      });
      
      repNew.map(r=>{
        if(r){
          const rep = r;
          const official = {
            name: rep.name_of_official,
            line1: rep.address_line_1,
            line2: rep.address_line_2,
            city: rep.city,
            state: rep.state,
            zip: rep.zip_code,
            party: rep.political_association,
            phones: [rep.phone_number],
            urls: [rep.website_url],
            channels: [
              {
                type: "Facebook",
                id: rep.facebook_url
              },
              {
                type: "Twitter",
                id: rep.twitter_url
              }
            ]
          };
          const office = {
            name: rep.office_title,
            divisionId: rep.division_id
          };
          let officialIndex = data.officials.push(official) - 1;
          let officeIndex = data.offices.push(office) - 1;
          if(data.divisions[rep.division_id]){
            if(!data.divisions[rep.division_id].officeIndices){
              data.divisions[rep.division_id].officeIndices = [];
            }
            data.divisions[rep.division_id].officeIndices.push(officeIndex);
            data.offices[officeIndex].officialIndices = [officialIndex];
          }
        }
      });
      /*
      rep.map(r=>{
        if(r) {
          const repre = r.toJSON();
          let officialIndex = data.officials.push(repre.official) - 1;
          let officeIndex = data.offices.push(repre.office) - 1;
          if(data.divisions[repre.divisionId]){
            if(!data.divisions[repre.divisionId].officeIndices){
              data.divisions[repre.divisionId].officeIndices = [];
            }
            data.divisions[repre.divisionId].officeIndices.push(officeIndex);
            data.offices[officeIndex].officialIndices = [officialIndex];
          }
        }
      });
      */
      res.json(data);
    }
    catch (err) {
      console.log(err);
      res.status(500).json({ error: "Something went wrong, unable to fetch results!" });
    }
}


        /*
      const resp = await Representative.findOne({
        subQuery: false,
        where: {
          searchTerm: {
            [Op.substring] : `${searchTerm.toLowerCase()}`,
            [Op.like] : `%${searchTerm}`
          }
        }
      });
      if (resp) {
        let divisionsData = resp.response;
        const keysOfDiv = Object.keys(divisionsData.divisions);
        const rep = await RepresentativeApplication.findAll({
          where: {
            divisionId: {
              [Op.in]: keysOfDiv
            }
          }   
        });
  
        rep.map(r=>{
          if(r) {
            const repre = r.toJSON();
            let officialIndex = divisionsData.officials.push(repre.official) - 1;
            let officeIndex = divisionsData.offices.push(repre.office) - 1;
            if(divisionsData.divisions[repre.divisionId] && divisionsData.divisions[repre.divisionId].officeIndices){
              divisionsData.divisions[repre.divisionId].officeIndices.push(officeIndex);
              divisionsData.offices[officeIndex].officialIndices = [officialIndex];
            }
          }
        });
        
        res.json({ ...divisionsData })
      }
      else {
        */