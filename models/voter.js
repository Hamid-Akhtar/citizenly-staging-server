  
const { DataTypes } = require('sequelize');
const sequelize2 = require('./sequelize2');

const Voter =  sequelize2.define('voters', {
    VOTER_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    FIRST_NAME : {
      type: DataTypes.STRING
      
    },
    MIDDLE_NAME : {
        type: DataTypes.STRING
        
    },
    LAST_NAME : {
        type: DataTypes.STRING
        
    },
    NAME_SUFFIX : {
        type: DataTypes.STRING
        
    },
    BIRTH_DATE : {
        type: DataTypes.STRING
        
    },
    CONFIDENTIAL : {
        type: DataTypes.STRING
    },
    EFF_REGN_DATE : {
        type: DataTypes.STRING
    },
    STATUS : {
        type: DataTypes.STRING
    },
    PARTY_CODE : {
        type: DataTypes.ENUM,
        values: [
            "DEM",
            "REP", 
            "CON",
            "IND",
            "LBT",
            "NAV",
            "OTH",      
            "PGP",      
            "PRO",      
            "WFP"    
        ],
        defaultValue: "DEM"
    },
    PHONE_NUM : {
        type: DataTypes.STRING
    },
    UNLISTED : {
        type: DataTypes.STRING
    },
    COUNTY : {
        type: DataTypes.STRING
    },
    RES_ADDRESS_1 : {
        type: DataTypes.STRING
    },
    RES_ADDRESS_2 : {
        type: DataTypes.STRING
    },
    HOUSE_NUM : {
        type: DataTypes.STRING
    },
    HOUSE_SUFFIX : {
        type: DataTypes.STRING
    },
    PRE_DIRECTION : {
        type: DataTypes.STRING
    },
    STREET_NAME : {
        type: DataTypes.STRING
    },
    STREET_TYPE : {
        type: DataTypes.STRING
    },
    POST_DIRECTION : {
        type: DataTypes.STRING
    },
    UNIT_TYPE : {
        type: DataTypes.STRING
    },
    UNIT_NUM : {
        type: DataTypes.STRING
    },
    ADDR_NON_STD : {
        type: DataTypes.STRING
    },
    CITY : {
        type: DataTypes.STRING
    },
    STATE : {
        type: DataTypes.STRING
    },
    ZIP_CODE : {
        type: DataTypes.STRING
    },
    ZIP_PLUS_FOUR : {
        type: DataTypes.STRING
    },
    EFF_ADDRESS_1 : {
        type: DataTypes.STRING
    },
    EFF_ADDRESS_2 : {
        type: DataTypes.STRING
    },
    EFF_ADDRESS_3 : {
        type: DataTypes.STRING
    },
    EFF_ADDRESS_4 : {
        type: DataTypes.STRING
    },
    EFF_CITY : {
        type: DataTypes.STRING
    },
    EFF_STATE : {
        type: DataTypes.STRING
    },
    EFF_ZIP_CODE : {
        type: DataTypes.STRING
    },
    EFF_ZIP_PLUS_FOUR : {
        type: DataTypes.STRING
    },
    ABSENTEE_TYPE : {
        type: DataTypes.STRING
    },
    PRECINCT_NAME : {
        type: DataTypes.STRING
    },
    PRECINCT : {
        type: DataTypes.STRING
    },
    SPLIT : {
        type: DataTypes.STRING
    }
  }, { updatedAt: false, createdAt: false, initialAutoIncrement: false });

module.exports = { Voter };