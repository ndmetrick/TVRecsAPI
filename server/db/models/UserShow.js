const Sequelize = require('sequelize');
const db = require('../db');

const UserShow = db.define('userShows', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  type: {
    type: Sequelize.ENUM('rec', 'watch', 'seen'),
    default: 'rec',
  },
  description: {
    type: Sequelize.STRING,
  },
  visible: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = UserShow;
