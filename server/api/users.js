const router = require('express').Router();
const User = require('../db/models/User');
const Follow = require('../db/models/Follow');
const Show = require('../db/models/Show');
require('dotenv').config({ path: './FIND.env' });
const { auth } = require('express-oauth2-jwt-bearer');

module.exports = router;

const checkJwt = auth({
  audience: process.env.CLIENTID,
  issuerBaseURL: `https://dev--5p-bz53.us.auth0.com/`,
});

router.get('/', checkJwt, async (req, res, next) => {
  try {
    console.log('trying this way to middleWare it');
    next();
  } catch (err) {
    next(err);
  }
});

const jwtDecode = require('jwt-decode');

// figure out gatekeeping middleware / how to protect back end
const { requireToken, isLoggedIn } = require('./gatekeepingMiddleware');
module.exports = router;

router.get('/addShow', checkJwt, async (req, res, next) => {
  try {
    //ADD SHOW
  } catch (err) {
    next(err);
  }
});

// router.get('/currentUser', requireToken, isLoggedIn, async (req, res, next) => {
//   try {
//     const user = await User.findAll({
//       where:
//       include: [models.Follow, models.Show],
//     });
//     console.log('current user', user);
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// });
