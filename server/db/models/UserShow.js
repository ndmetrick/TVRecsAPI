const Sequelize = require('sequelize');
const db = require('../db');

const UserShow = db.define('userShows', {
  description: {
    type: Sequelize.STRING,
  },
});

module.exports = UserShow;
