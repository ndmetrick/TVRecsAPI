const Sequelize = require('sequelize');
const db = require('../db');

const Tag = db.define('tags', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  type: {
    type: Sequelize.ENUM(
      'profile-like',
      'profile-dislike',
      'profile',
      'profile-describe',
      'tv',
      'warning',
      'unassigned'
    ),
    defaultValue: 'tv',
  },
});

module.exports = Tag;
