const db = require('./db');

const User = require('./models/User');
const Follow = require('./models/Follow');
const Show = require('./models/Show');
const UserShow = require('./models/UserShow');

User.belongsToMany(User, {
  through: Follow,
  as: 'Followers',
  foreignKey: 'follower',
});
User.belongsToMany(User, {
  through: Follow,
  as: 'Following',
  foreignKey: 'following',
});

User.hasMany(Follow, {
  as: 'FollowerLinks',
  foreignKey: 'follower',
});
User.hasMany(Follow, {
  as: 'FollowingLinks',
  foreignKey: 'following',
});

Follow.belongsTo(User, {
  as: 'Following,',
  foreignKey: 'following',
});

Follow.belongsTo(User, {
  as: 'Followers,',
  foreignKey: 'follower',
});

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
    Follow,
    Show,
    UserShow,
  },
};
