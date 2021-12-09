'use strict';
const Tag = require('./server/db/models/Tag');
const db = require('./server/db/db.js');

async function seed() {
  try {
    await db.sync({ force: true });
    await Tag.bulkCreate([
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
      { name: 'alternative family', type: 'unassigned' },
      { name: 'transgender/non-binary characters', type: 'unassigned' },
      { name: 'LGBTQ main characters', type: 'unassigned' },
      { name: 'LGB main characters', type: 'unassigned' },
      { name: 'queer love', type: 'unassigned' },
      { name: 'BIPOC main characters', type: 'tv' },
      { name: 'BIPOC best friend', type: 'unassigned' },
      { name: 'cultural appropriation', type: 'warning' },
      { name: 'good soundtrack', type: 'unassigned' },
      { name: 'witty jokes', type: 'unassigned' },
      { name: 'wacky', type: 'unassigned' },
      { name: 'unusual', type: 'unassigned' },
      { name: 'happy ending', type: 'unassigned' },
      { name: 'child abuse', type: 'warning' },
      { name: 'childbirth', type: 'unassigned' },
      { name: 'good music', type: 'unassigned' },
      { name: 'funny', type: 'tv' },
      { name: 'the town comes together', type: 'unassigned' },
      { name: 'pregnancy', type: 'tv' },
      {
        name: 'accurate representation of underrepresented groups',
        type: 'unassigned',
      },
      { name: 'autistic characters', type: 'unassigned' },
      {
        name: 'inaccurate represenation of underrepresented groups',
        type: 'warning',
      },
      {
        name: 'neurotypical actor portraying autistic character',
        type: 'warning',
      },
      { name: 'multi-episode arcs', type: 'unassigned' },
      { name: 'slow burn', type: 'unassigned' },
      { name: 'posessive love', type: 'warning' },
      { name: 'animal death', type: 'warning' },
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
    console.log(`seeded successfully`);
  } catch (err) {
    console.log(err);
  }
}

// async function runSeed() {
//   console.log('seeding...');
//   try {
//     await seed();
//   } catch (err) {
//     console.error(err);
//     process.exitCode = 1;
//   } finally {
//     console.log('closing db connection');
//     await db.close();
//     console.log('db connection closed');
//   }
// }

if (module === require.main) {
  seed();
}

module.exports = seed;
