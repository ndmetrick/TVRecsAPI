const router = require('express').Router();
const User = require('../db/models/User');
// const Follow = require('../db/models/Follow');
const UserShow = require('../db/models/UserShow');
const Show = require('../db/models/Show');
const Tag = require('../db/models/Tag');
require('dotenv').config({ path: './FIND.env' });
const { auth } = require('express-oauth2-jwt-bearer');
Sequelize = require('sequelize');

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

router.get('/keys/:api', (req, res, next) => {
  try {
    const api = req.params.api;
    if (api === 'omdb') return process.env['OMDB-KEY'];
    if (api === 'tmdb') return process.env['TMDB-KEY'];
  } catch (e) {
    console.log(e);
    next(e);
  }
});

router.get('/all', async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      const otherUsers = await User.findAll();
      res.send(otherUsers);
    }
    const decoded = jwtDecode(req.headers.authorization);
    let user = await findUserFromToken(decoded);
    if (user) {
      const otherUsers = await User.findAll({
        where: {
          id: {
            [Sequelize.Op.ne]: user.id,
          },
        },
      });
      res.send(otherUsers);
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
      user = await User.create({
        username: decoded.name,
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
    let userShows;
    if (req.params.uid === 'undefined') {
      const decoded = jwtDecode(req.headers.authorization);
      const user = await findUserFromToken(decoded);
      if (user) {
        userShows = await UserShow.findAll({
          where: {
            userId: user.id,
            toWatch: false,
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
          toWatch: false,
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
          toWatch: true,
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

router.get('/recs', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    if (user) {
      if (user) {
        const following = await user.getFollowed();
        let followedRecs = [];
        for (let i = 0; i < following.length; i++) {
          const followedId = following[i].id;
          const recs = await UserShow.findAll({
            where: {
              userId: followedId,
              toWatch: false,
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
    }
  } catch (err) {
    next(err);
  }
});

router.get('/following/:uid', async (req, res, next) => {
  try {
    let user;
    if (typeof req.params.uid === 'number') {
      user = await User.findByPk(req.params.uid);
    } else {
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

router.put('/addShow/:toWatch', checkJwt, async (req, res, next) => {
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
      const { imdbId, imageUrl, streaming, purchase } = show;
      foundShowInDatabase = await Show.create({
        name: show.showName,
        imdbId,
        imageUrl,
        streaming,
        purchase,
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
    const toWatch = req.params.toWatch;
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
    userShow.description = show.description;
    userShow.toWatch = toWatch;
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
    if (typeof req.params.uid === 'number') {
      user = await User.findByPk(req.params.uid);
    } else {
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
    const { tags } = req.body;
    user.setTags(tags);
    res.send(tags);
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
    const { tagIds } = req.body;
    console.log('i got this far', tagIds);
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

    console.log('updatedUserShow', updatedUserShow);

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
    console.log('this is usershowid', req.body.userShowId);
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

    if (req.body.tagIds) {
      await userShow.setTags(req.body.tagIds);
    }

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
    updatedUserShow.toWatch = false;
    updatedUserShow.description = req.body.description;
    updatedUserShow.save();
    res.send(updatedUserShow);
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
