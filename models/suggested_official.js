const { DataTypes } = require('sequelize');
const sequelize = require('./sequalize');

const SuggestedOfficial = sequelize.define('suggested_official', {
    name_of_official: {
      type: DataTypes.STRING,
      allowNull: false
    },
    request_status: {
      type: DataTypes.ENUM(["ACCEPTED", "PENDING", "DECLINED", "ARCHIVED"]),
      defaultValue: "PENDING"
    },
    office_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    non_partisan: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    jurisdiction: {
      type: DataTypes.STRING
    },
    agency: {
      type: DataTypes.STRING
    },
    display_party_affiliation: {
      type: DataTypes.TINYINT,
      defaultValue: 0
    },
    political_association: {
        type: DataTypes.STRING,
      },
    phone_number: {
        type: DataTypes.STRING
    },
    email_address: {
        type: DataTypes.STRING
    },
    address_line_1: {
        type: DataTypes.STRING
    },
    address_line_2: {
        type: DataTypes.STRING
    },
    photo_url: {
         type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    zip_code: {
        type: DataTypes.STRING
    },
    website_url: {
        type: DataTypes.STRING
    },
    facebook_url: {
        type: DataTypes.STRING
    },
    twitter_url: {
        type: DataTypes.STRING
    },
    linked_in_url: {
        type: DataTypes.STRING
    },
    instagram_url: {
        type: DataTypes.STRING
    },
    division_id: {
        type: DataTypes.STRING
    },
    submitter_id: {
        type: DataTypes.STRING
    },
    created_by: {
        type: DataTypes.STRING
    },
    modified_by: {
        type: DataTypes.STRING
    },
    reviewer_id: {
        type: DataTypes.STRING
    },
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, { updatedAt: true, createdAt: true, initialAutoIncrement: false });

  module.exports = { SuggestedOfficial };