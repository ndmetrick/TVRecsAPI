const Sequelize = require('sequelize');
const db = require('../db');

const UserShow = db.define('userShows', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  toWatch: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  description: {
    type: Sequelize.STRING,
  },
});

module.exports = UserShow;
