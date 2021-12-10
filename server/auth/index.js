const router = require('express').Router();
const User = require('../db/models/User');
// const Follow = require('../db/models/Follow');
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
  const decoded = jwtDecode(token);
  return await User.findAll({
    where: {
      auth0Id: decoded.sub,
    },
    include: {
      model: [Show],
    },
  })[0];
};

// router.get('/', checkJwt, async (req, res, next) => {
//   try {
//     console.log('trying this way to middleWare it');
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

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
    let user = await findUserFromToken(req.headers.authorization);
    if (user) {
      console.log('i got this user', user);
      res.send(user);
    } else {
      //***** */
      console.log('CANNOT FIND A USER so I am making a new one');
      const decoded = jwtDecode(req.headers.authorization);
      user = await User.create({
        email: decoded.email,
        username: decoded.username,
        auth0Id: decoded.sub,
      });
      console.log('user on back end', user);
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/addShow', checkJwt, async (req, res, next) => {
  try {
    console.log('trying this way to middleWare it');
    const show = req.body;
    // get the id of the show from the database
    let showId = await Show.findAll({
      where: {
        imdbId: show.imdbId,
      },
    }).id;
    console.log('showIdabove', showId);
    // if the show isn't already in the database, add it and then get the id
    if (!showId) {
      const { imdbId, imageUrl, streaming, purchase } = show;
      const showInDatabase = await Show.create({
        show: show.showName,
        imdbId,
        imageUrl,
        streaming,
        purchase,
      });
      showId = showInDatabase.id;
      console.log('showIdbelow', showId);
    }
    // get the user and then add the show to the user and return the user
    const user = await findUserFromToken(req.headers.authization);
    console.log('userbeforeshow', user);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await user.addShow(showId);
    console.log('useraftershow', user);
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// router.get('/me', async (req, res, next) => {
//   try {
//     res.send(await User.findByToken(req.headers.authorization));
//   } catch (ex) {
//     next(ex);
//   }
// });
