const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  auth0Id: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  country: {
    type: Sequelize.STRING,
    defaultValue: 'US',
  },
  filter: {
    type: Sequelize.ENUM(
      'collapse-allow',
      'collapse-exclude',
      'expand-allow',
      'expand-exclude'
    ),
    defaultValue: 'collapse-allow',
  },
  description: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
