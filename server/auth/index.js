const router = require('express').Router();
const User = require('../db/models/User');
const Follow = require('../db/models/Follow');
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

router.get('/', checkJwt, async (req, res, next) => {
  try {
    console.log('trying this way to middleWare it');
    next();
  } catch (err) {
    next(err);
  }
});

router.get('/login', checkJwt, async (req, res, next) => {
  try {
    console.log('i got here to login');
    const token = jwtDecode(req.headers.authorization);
    console.log('token', token);
    // const { data } = await auth0.getUsers({ id: token.sub });

    // HOW TO GET DATA
    // if (data.blocked === true) {
    //   throw new Error('Blocked');
    // }
    // if (data.email_verified === false) {
    //   throw new Error('Email not verified');
    // }
    const user = await User.findAll({
      where: {
        auth0Id: token.sub,
      },
      // include: {
      //   model: [Show, Follow],
      // },
    });
    if (user.length) {
      console.log('i got this user', user);
      res.send(user);
    } else {
      //***** */

      console.log('CANNOT FIND A USER so I am making a new one');
      const user = await User.create({
        username: token.name,
        auth0Id: token.sub,
      });
      console.log('user on back end', user);
      res.send(user);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/', checkJwt, async (req, res, next) => {
  try {
    console.log('trying this way to middleWare it');
    next();
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
