const router = require('express').Router();
const User = require('../db/models/User');
// const Follow = require('../db/models/Follow');
const UserShow = require('../db/models/UserShow');
const Show = require('../db/models/Show');
const Tag = require('../db/models/Tag');
require('dotenv').config({ path: './FIND.env' });
const { auth } = require('express-oauth2-jwt-bearer');
Sequelize = require('sequelize');
const db = require('../db/db');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: process.env.CLIENTID,
  issuerBaseURL: `https://dev--5p-bz53.us.auth0.com/`,
});

const jwtDecode = require('jwt-decode');
module.exports = router;
// const ManagementClient = require('auth0').ManagementClient;

// const auth0 = new ManagementClient({
//   domain: 'dev--5p-bz53.us.auth0.com',
//   clientId: process.env.CLIENTID,
//   clientSecret: process.env.CLIENTSECRET,
// });

const findUserFromToken = async (token) => {
  const users = await User.findOne({
    where: {
      auth0Id: token.sub,
    },
  });
  return users;
};

router.post('/addTags', checkJwt, async (req, res, next) => {
  try {
    console.log('got in here againt');
    if (req.headers.authorization) {
      const decoded = jwtDecode(req.headers.authorization);
      let user = await findUserFromToken(decoded);
      if (user) {
        if (user.username === 'ndmetrick') {
          console.log('reqbody', req.body);
          const { tag } = req.body;
          await Tag.create(tag);
          res.sendStatus(200);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.delete('/deleteTags', checkJwt, async (req, res, next) => {
  try {
    console.log('got in here to delete');
    if (req.headers.authorization) {
      const decoded = jwtDecode(req.headers.authorization);
      let user = await findUserFromToken(decoded);
      if (user) {
        if (user.username === 'ndmetrick') {
          console.log('got in here to username');
          const { tagName } = req.body;
          const tag = await Tag.findOne({
            where: {
              name: tagName,
            },
          });
          await tag.destroy();
          res.sendStatus(200);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});

router.get('/authInfo', (req, res, next) => {
  try {
    res.send([process.env.CLIENTID, process.env.AUTH_ENDPOINT]);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get('/keys/:api', (req, res, next) => {
  try {
    console.log('got in here to keys');
    const api = req.params.api;
    if (api === 'omdb') res.send(process.env.OMDB);
    if (api === 'tmdb') res.send(process.env.TMDB);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    console.log('helpppp');
    if (!req.headers.authorization) {
      const otherUsers = await User.findAll();
      if (otherUsers) {
        console.log('here it is', otherUsers);
        res.send(otherUsers);
      }
    } else {
      const decoded = jwtDecode(req.headers.authorization);
      let user = await findUserFromToken(decoded);
      if (user) {
        const check = await User.findAll({
          attributes: ['username', 'id'],
        });
        console.log('check', check);
        const otherUsers = await User.findAll({
          where: {
            id: { [Sequelize.Op.ne]: user.id },
          },
          attributes: ['username', 'id'],
        });
        console.log('otheruers', otherUsers);
        res.send(otherUsers);
      }
    }
  } catch (err) {
    next(err);
  }
});

router.put('/getMatchingUsers', async (req, res, next) => {
  try {
    console.log('got to get matching users');
    const { filters } = req.body;
    console.log('filters', filters);
    let sqlQuery = `SELECT users.id, users.username
      FROM   users `;
    console.log('i know this is this version');
    const sequelize = new Sequelize(
      process.env.DATABASE_URL ?? `postgres://localhost:5432/tv-recs`
    );

    if (filters['commonTags']) {
      // SELECT users.id, users.username, COUNT(*) as how_many_shared_tags
      // FROM   users
      const decoded = jwtDecode(req.headers.authorization);
      const user = await findUserFromToken(decoded);
      const userId = user.id;
      const numTagsInCommon = filters['commonTags'];

      sqlQuery += `JOIN "ProfileTags" ON "ProfileTags"."userId" = users.id
                     AND "ProfileTags"."tagId" IN(SELECT "tagId" FROM "ProfileTags" WHERE "userId" = ${userId})
    WHERE users.id != ${userId}
    GROUP BY users.id, users.username
    HAVING COUNT(*) >= ${numTagsInCommon}`;
    }

    if (filters['chooseTags']) {
      const tagIds = filters['chooseTags'];
      sqlQuery += `WHERE users.id IN (SELECT "userId" FROM "ProfileTags" WHERE "tagId" = ${tagIds[0]})`;
      tagIds.slice(1).forEach((tagId) => {
        sqlQuery += `AND users.id IN (SELECT "userId" FROM "ProfileTags" WHERE "tagId" = ${tagId})`;
      });
    }

    if (filters['filterCount'] === 1) {
      if (filters['chooseShow']) {
        const chosenShowImdbId = filters['chooseShow'].toString();
        const chosenShow = await Show.findOne({
          where: {
            imdbId: chosenShowImdbId,
          },
        });
        const chosenShowId = chosenShow.id;
        sqlQuery += `WHERE users.id IN (SELECT "userId" FROM "userShows" WHERE "showId" = ${chosenShowId})`;
      }
      if (filters['commonShows']) {
        const decoded = jwtDecode(req.headers.authorization);
        const user = await findUserFromToken(decoded);
        const userId = user.id;
        const numShowsInCommon = filters['commonShows'];

        sqlQuery += `JOIN "userShows" ON "userShows"."userId" = users.id
                       AND "userShows"."showId" IN(SELECT "showId" FROM "userShows" WHERE "userId" = ${userId})
      WHERE users.id != ${userId}
      GROUP BY users.id, users.username
      HAVING COUNT(*) >= ${numShowsInCommon}
      ORDER by COUNT(*) DESC`;
      }

      if (filters['chooseCommonShows']) {
        const showIds = filters['chooseCommonShows'];
        sqlQuery += `WHERE users.id IN (SELECT "userId" FROM "userShows" WHERE "showId" = ${showIds[0]})`;
        showIds.slice(1).forEach((showId) => {
          sqlQuery += `AND users.id IN (SELECT "userId" FROM "userShows" WHERE "showId" = ${showId})`;
        });
      }
    } else {
      if (filters['chooseShow']) {
        const chosenShowImdbId = filters['chooseShow'].toString();
        const chosenShow = await Show.findOne({
          where: {
            imdbId: chosenShowImdbId,
          },
        });
        const chosenShowId = chosenShow.id;
        sqlQuery += `AND users.id IN (SELECT "userId" FROM "userShows" WHERE "showId" = ${chosenShowId})`;
      }

      if (filters['commonShows']) {
        const decoded = jwtDecode(req.headers.authorization);
        const user = await findUserFromToken(decoded);
        const userId = user.id;
        const numShowsInCommon = filters['commonShows'];

        sqlQuery += `AND users.id IN(SELECT users.id
      FROM   users
      JOIN "userShows" ON "userShows"."userId" = users.id
                       AND "userShows"."showId" IN(SELECT "showId" FROM "userShows" WHERE "userId" = ${userId})
      WHERE users.id != ${userId}
      GROUP BY users.id, users.username
      HAVING COUNT(*) >= ${numShowsInCommon})`;
      }
      if (filters['chooseCommonShows']) {
        const showIds = filters['chooseCommonShows'];
        showIds.forEach((showId) => {
          sqlQuery += `AND users.id IN (SELECT "userId" FROM "userShows" WHERE "showId" = ${showId})`;
        });
      }
    }

    const otherUsers = await sequelize.query(sqlQuery);
    console.log('what does this do', otherUsers[0]);
    if (otherUsers) {
      res.send(otherUsers[0]);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/otherUser/:userId', async (req, res, next) => {
  try {
    const otherUser = await User.findByPk(req.params.userId);
    if (otherUser) {
      res.send(otherUser);
    } else {
      console.log(`Could not find a user with id ${req.params.userId}`);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/login', checkJwt, async (req, res, next) => {
  try {
    // const { data } = await auth0.getUsers({ id: token.sub });

    // HOW TO GET DATA
    // if (data.blocked === true) {
    //   throw new Error('Blocked');
    // }
    // if (data.email_verified === false) {
    //   throw new Error('Email not verified');
    // }
    const decoded = jwtDecode(req.headers.authorization);
    let user = await findUserFromToken(decoded);
    if (user) {
      res.send(user);
    } else {
      const decoded = jwtDecode(req.headers.authorization);
      console.log('decoded is this now', decoded);
      user = await User.create({
        email: decoded.name,
        username: decoded['https://mynamespace/username'],
        auth0Id: decoded.sub,
      });
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/shows/:uid', async (req, res, next) => {
  try {
    let userShows = [];
    if (req.params.uid === 'undefined' && req.headers.authorization) {
      const decoded = jwtDecode(req.headers.authorization);
      const user = await findUserFromToken(decoded);
      if (user) {
        userShows = await UserShow.findAll({
          where: {
            userId: user.id,
            type: 'rec',
          },
          include: [
            {
              model: Show,
            },
            {
              model: Tag,
            },
          ],
        });
      } else {
        userShows = '-1';
      }
    } else {
      userShows = await UserShow.findAll({
        where: {
          userId: req.params.uid,
          type: 'rec',
        },
        include: [
          {
            model: Show,
          },
          {
            model: Tag,
          },
        ],
      });
    }
    res.send(userShows);
  } catch (err) {
    next(err);
  }
});

router.get('/showsToWatch', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (user) {
      const toWatch = await UserShow.findAll({
        where: {
          userId: user.id,
          type: 'watch',
        },
        include: [
          {
            model: Show,
          },
          {
            model: Tag,
          },
        ],
      });
      res.send(toWatch);
    } else {
      res.sendStatus(404);
      // add message
    }
  } catch (err) {
    next(err);
  }
});

router.get('/seenShows', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (user) {
      const seen = await UserShow.findAll({
        where: {
          userId: user.id,
          type: 'seen',
        },
        include: [
          {
            model: Show,
          },
          {
            model: Tag,
          },
        ],
      });
      res.send(seen);
    } else {
      res.sendStatus(404);
      // add message
    }
  } catch (err) {
    next(err);
  }
});

router.get('/recs', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (user) {
      const following = await user.getFollowed();
      let followedRecs = [];
      for (let i = 0; i < following.length; i++) {
        const followedId = following[i].id;
        const recs = await UserShow.findAll({
          where: {
            userId: followedId,
            type: 'rec',
          },
          include: [
            {
              model: Show,
            },
            {
              model: Tag,
            },
            {
              model: User,
              where: {
                id: followedId,
              },
            },
          ],
        });
        followedRecs = [...followedRecs, ...recs];
      }
      res.send(followedRecs);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/following/:uid', async (req, res, next) => {
  try {
    let user;
    if (req.params.uid !== 'undefined') {
      console.log('i got in here');
      user = await User.findByPk(req.params.uid);
    } else if (req.headers.authorization) {
      console.log(
        'this is what authorization looks like here',
        req.headers.authorization
      );
      const decoded = jwtDecode(req.headers.authorization);
      user = await findUserFromToken(decoded);
    }
    if (user) {
      const followed = await user.getFollowed();
      res.send(followed);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/addShow/:type', checkJwt, async (req, res, next) => {
  try {
    const show = req.body;
    // get the id of the show from the database
    let foundShowInDatabase = await Show.findOne({
      where: {
        imdbId: show.imdbId.toString(),
      },
    });
    // if the show isn't already in the database, add it and then get the id
    if (!foundShowInDatabase) {
      const { imdbId, imageUrl } = show;
      foundShowInDatabase = await Show.create({
        name: show.showName,
        imdbId,
        imageUrl,
      });
    }
    const showId = foundShowInDatabase.id;

    // get the user and then add the show to the user and return the user

    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);

    if (!user) {
      res.sendStatus(404);
      return;
    }
    const type = req.params.type;
    await user.addShow(showId);
    const userShow = await UserShow.findOne({
      where: {
        showId,
        userId: user.id,
      },
      include: [
        {
          model: Show,
        },
        {
          model: Tag,
        },
      ],
    });
    userShow.type = type;
    userShow.save();
    console.log('userShow', userShow);

    res.send(userShow);
  } catch (err) {
    next(err);
  }
});

router.get('/getUserTags/:uid', async (req, res, next) => {
  try {
    let user = null;
    if (req.params.uid !== 'undefined') {
      user = await User.findByPk(req.params.uid);
    } else if (req.headers.authorization) {
      const decoded = jwtDecode(req.headers.authorization);
      user = await findUserFromToken(decoded);
    }
    // if (!user) {
    //   res.sendStatus(404);
    //   return;
    // }
    if (user) {
      const tags = await user.getTags();
      res.send(tags);
    }
  } catch (err) {
    next(err);
  }
});

router.get('/getAllTags', async (req, res, next) => {
  try {
    const tags = await Tag.findAll();
    res.send(tags);
  } catch (err) {
    next(err);
  }
});

router.put('/changeUserTags', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const { userTagIds, description } = req.body;
    await user.setTags(userTagIds);
    console.log('this is description', description);
    user.description = description;
    user.save();
    const tags = await user.getTags();
    const tagsAndDescription = { tags, description };
    res.send(tagsAndDescription);
  } catch (err) {
    next(err);
  }
});

router.put('/changeCountry', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const { newCountry } = req.body;
    console.log('this is the new country', newCountry);
    user.country = newCountry;
    user.save();
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.put('/changeShowTags', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const { tagIds, description } = req.body;
    const userShow = await UserShow.findOne({
      where: {
        id: req.body.userShowId,
        userId: user.id,
      },
      include: [
        {
          model: Show,
        },
        {
          model: Tag,
        },
      ],
    });
    console.log('this is the userShow in changeShowtags', userShow);
    if (!userShow) {
      res.sendStatus(404);
      return;
    }
    await userShow.setTags(tagIds);
    const updatedUserShow = await UserShow.findByPk(userShow.id, {
      include: [
        {
          model: Show,
        },
        {
          model: Tag,
        },
      ],
    });
    console.log('req.body in changeUserTags', req.body);

    updatedUserShow.description = req.body.description;
    updatedUserShow.save();
    res.send(updatedUserShow);
  } catch (err) {
    next(err);
  }
});

router.put('/switchShow', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    const userShow = await UserShow.findOne({
      where: {
        id: req.body.userShowId,
        userId: user.id,
      },
      include: [
        {
          model: Show,
        },
        {
          model: Tag,
        },
      ],
    });
    if (!userShow) {
      res.sendStatus(404);
      return;
    }

    //  const updatedUserShow = await UserShow.findByPk(userShow.id, {
    //    include: [
    //      {
    //        model: Show,
    //      },
    //      {
    //        model: Tag,
    //      },
    //    ],
    //  });
    console.log('i got here, reqbody', req.body.newType);
    const oldType = userShow.type;
    userShow.type = req.body.newType;
    userShow.save();

    res.send({ userShow, oldType });
  } catch (err) {
    next(err);
  }
});

router.put('/deleteShow', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    const showId = req.body.showId;
    const userShow = await UserShow.findOne({
      where: {
        showId,
        userId: user.id,
      },
      include: [
        {
          model: Show,
        },
        {
          model: Tag,
        },
      ],
    });
    await userShow.destroy();
    res.send(userShow);
  } catch (err) {
    next(err);
  }
});

router.put('/follow', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (user) {
      const followedId = req.body.uid;
      await user.addFollowed(followedId);
      const followed = await User.findByPk(followedId);
      res.send(followed);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/unfollow', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    const unfollowedId = req.body.uid;
    const unfollowed = await user.removeFollowed(unfollowedId);

    if (unfollowed === 1) {
      res.send({ id: unfollowedId });
    } else {
      console.error('Error. Could not unfollow that user');
    }
  } catch (err) {
    next(err);
  }
});
