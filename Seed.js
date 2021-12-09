/* eslint-disable max-statements */
const { green, red } = require('chalk');
const Tag = require('./server/db/models/Tag');
const db = require('./server/db/db.js');

async function seed() {
  try {
    await db.sync({ force: true });
    Tag.bulkCreate([
      { name: 'romantic comedy', type: 'tv' },
      { name: 'romantic comedies', type: 'profile' },
      { name: 'action', type: 'unassigned' },
      { name: 'thriller', type: 'tv' },
      { name: 'thrillers', type: 'profile' },
      { name: 'queer', type: 'unassigned' },
      { name: 'violence', type: 'warning' },
      { name: 'animal suffering', type: 'warning' },
      { name: 'transphobia', type: 'warning' },
      { name: 'racism', type: 'warning' },
      { name: 'sexism', type: 'warning' },
      { name: 'cute', type: 'tv' },
      { name: 'warm', type: 'tv' },
      { name: 'suspenseful', type: 'tv' },
      { name: 'suspense', type: 'profile' },
      { name: 'mystery', type: 'unassigned' },
      { name: 'confusing', type: 'warning' },
      { name: 'complex', type: 'tv' },
      { name: 'comforting', type: 'unassigned' },
      { name: 'about parenthood', type: 'unassigned' },
      { name: 'lesbian', type: 'unassigned' },
      { name: 'transgender', type: 'unassigned' },
      { name: 'non-binary', type: 'unassigned' },
      { name: 'gay', type: 'unassigned' },
      { name: 'bisexual', type: 'unassigned' },
      { name: 'unusual', type: 'unassigned' },
      { name: 'funny', type: 'tv' },
      { name: 'music', type: 'unassigned' },
      { name: 'comedies', type: 'profile' },
      { name: 'diverse cast', type: 'unassigned' },
      { name: 'verisimilar', type: 'unassigned' },
      { name: 'silly', type: 'tv' },
      { name: 'smart', type: 'tv' },
      { name: 'silliness', type: 'profile' },
      { name: 'some silliness but not too much', type: 'profile' },
      { name: 'give me all the silliness', type: 'unassigned' },
      { name: 'serious', type: 'unassigned' },
      { name: 'drama', type: 'unassigned' },
    ]);
  } catch (err) {
    console.log(red(err));
  }
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
