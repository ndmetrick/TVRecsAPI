const db = require('./db');

const User = require('./models/User');
// const Follow = require('./models/Follow');
const Show = require('./models/Show');
const UserShow = require('./models/UserShow');

User.belongsToMany(User, {
  through: 'Follow',
  as: 'followers',
  foreignKey: 'followed',
});
User.belongsToMany(User, {
  through: 'Follow',
  as: 'followed',
  foreignKey: 'follower',
});

// User.hasMany(Follow, {
//   as: 'FollowerLinks',
//   foreignKey: 'followerId',
// });
// User.hasMany(Follow, {
//   as: 'FollowedLinks',
//   foreignKey: 'followedId',
// });

// Follow.belongsTo(User, {
//   as: 'Followed,',
//   foreignKey: 'followedId',
// });

// Follow.belongsTo(User, {
//   as: 'Followers,',
//   foreignKey: 'followerId',
// });

User.belongsToMany(Show, { through: UserShow });
Show.belongsToMany(User, { through: UserShow });

User.hasMany(UserShow);
UserShow.belongsTo(User);

Show.hasMany(UserShow);
UserShow.belongsTo(Show);

module.exports = {
  db,
  models: {
    User,
    // Follow,
    Show,
    UserShow,
  },
};
