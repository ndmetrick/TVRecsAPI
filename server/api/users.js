const router = require('express').Router();
const User = require('../db/models/User');
const Follow = require('../db/models/Follow');
const UserShow = require('../db/models/UserShow');
const Show = require('../db/models/Show');
require('dotenv').config({ path: './FIND.env' });
const { auth } = require('express-oauth2-jwt-bearer');

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

router.get('/login', checkJwt, async (req, res, next) => {
  try {
    console.log('i got here to login');

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

router.get('/shows', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    console.log('I GOT HERE');
    const userShows = await UserShow.findAll({
      where: {
        userId: user.id,
      },
      include: {
        model: Show,
      },
    });
    res.send(userShows);
  } catch (err) {
    next(err);
  }
});

router.get('/following', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    const following = await Follow.findAll({
      where: {
        follower: user.id,
      },
      // include: [
      //   {
      //     model: User,
      //     as: 'Following',
      //   },
      // ],
    });
    console.log('following in back end', following);
    res.send(following);
  } catch (err) {
    next(err);
  }
});

router.put('/addShow', checkJwt, async (req, res, next) => {
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
    await user.addShow(showId);
    const userShow = await UserShow.findOne({
      where: {
        showId,
        userId: user.id,
      },
      include: {
        model: Show,
      },
    });
    userShow.description = show.description;
    userShow.save();

    res.send(userShow);
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
      include: {
        model: Show,
      },
    });
    console.log(userShow, 'userShow');
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
    const followedId = req.body;
    const followed = await user.addFollowing(followedId);
    console.log('followed', followed);
    res.send(followed);
  } catch (err) {
    next(err);
  }
});

router.delete('/unfollow', checkJwt, async (req, res, next) => {
  try {
    const decoded = jwtDecode(req.headers.authorization);
    const user = await findUserFromToken(decoded);
    const unfollowedId = req.body;
    const unfollowed = await Follow.findOne({
      where: {
        followed: unfollowedId,
        follower: user.id,
      },
    });
    console.log('unfollowed', unfollowed);
    await unfollowed.destroy();
    res.send(unfollowed);
  } catch (err) {
    next(err);
  }
});
