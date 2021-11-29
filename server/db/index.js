const db = require('./db');

const User = require('./models/User');
// const Follow = require('./models/Follow');
const Show = require('./models/Show');
const UserShow = require('./models/UserShow');
const Tag = require('./models/Tag');

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

User.belongsToMany(Show, { through: UserShow });
Show.belongsToMany(User, { through: UserShow });

User.hasMany(UserShow);
UserShow.belongsTo(User);

Show.hasMany(UserShow);
UserShow.belongsTo(Show);

UserShow.belongsToMany(Tag, { through: 'UserShowTags' });
Tag.belongsToMany(UserShow, { through: 'UserShowTags' });

User.belongsToMany(Tag, { through: 'ProfileTags' });
Tag.belongsToMany(User, { through: 'ProfileTags' });

module.exports = {
  db,
  models: {
    User,
    Show,
    UserShow,
    Tag,
  },
};
