'use strict';
const Tag = require('./server/db/models/Tag');
const db = require('./server/db/db.js');

async function seed() {
  try {
    await db.sync({ force: true });
    await Tag.bulkCreate([
      { name: 'romantic comedy', type: 'tv' },
      { name: 'romantic', type: 'tv' },
      { name: 'weird', type: 'unassigned' },
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
      { name: 'warm', type: 'tv' },
      { name: 'suspenseful', type: 'tv' },
      { name: 'suspense', type: 'profile' },
      { name: 'mystery', type: 'unassigned' },
      { name: 'confusing', type: 'warning' },
      { name: 'complex', type: 'tv' },
      { name: 'shows that love their characters', type: 'profile' },
      { name: 'reality tv', type: 'unassigned' },
      { name: 'cancelled midstream', type: 'warning' },
      { name: 'sports', type: 'unassigned' },
      { name: 'positive portrayal of polyamory', type: 'tv' },
      { name: 'currently watching', type: 'tv' },
      { name: 'comforting', type: 'unassigned' },
      { name: 'about parenthood', type: 'unassigned' },
      { name: 'about family', type: 'tv' },
      { name: 'alternative family', type: 'unassigned' },
      { name: 'transgender/non-binary characters', type: 'unassigned' },
      { name: 'about friendship', type: 'unassigned' },
      { name: 'LGBTQ main characters', type: 'tv' },
      { name: 'LGB main characters', type: 'unassigned' },
      { name: 'true crime', type: 'unassigned' },
      { name: 'documentary', type: 'tv' },
      { name: 'documentaries', type: 'profile' },
      { name: 'teen', type: 'tv' },
      { name: 'cringey', type: 'tv' },
      { name: 'miniseries', type: 'unassigned' },
      { name: 'musical', type: 'tv' },
      { name: 'musicals', type: 'profile' },
      { name: 'hate-watch', type: 'tv' },
      { name: 'hate-watching', type: 'profile' },
      { name: 'cliche', type: 'warning' },
      { name: 'relaxing-in-the-background', type: 'unassigned' },
      { name: 'hopeful', type: 'unassigned' },
      { name: 'mainstream values', type: 'warning' },
      { name: 'queer love', type: 'unassigned' },
      { name: 'BIPOC main characters', type: 'tv' },
      { name: 'cultural appropriation', type: 'warning' },
      { name: 'witty jokes', type: 'unassigned' },
      { name: 'wacky', type: 'tv' },
      { name: 'unusual', type: 'unassigned' },
      { name: 'happy ending', type: 'tv' },
      { name: 'happy endings', type: 'profile' },
      { name: 'child abuse', type: 'warning' },
      { name: 'good music', type: 'unassigned' },
      { name: 'funny', type: 'tv' },
      { name: 'the town comes together', type: 'unassigned' },
      { name: 'pregnancy', type: 'tv' },
      {
        name: 'accurate representation of underrepresented groups',
        type: 'unassigned',
      },
      { name: 'intense', type: 'tv' },
      { name: 'intensity', type: 'tv' },
      { name: 'slow', type: 'tv' },
      { name: 'rewards patience', type: 'tv' },
      { name: 'depressing', type: 'warning' },
      { name: 'show loves its characters', type: 'tv' },
      { name: 'talk show', type: 'tv' },
      { name: 'sci-fi', type: 'unassigned' },
      { name: 'animation', type: 'unassigned' },
      { name: 'horror', type: 'unassigned' },
      { name: 'autistic characters', type: 'tv' },
      {
        name: 'inaccurate represenation of underrepresented groups',
        type: 'warning',
      },
      {
        name: 'neurotypical actor portraying autistic character',
        type: 'warning',
      },
      { name: 'multi-episode arcs', type: 'unassigned' },
      { name: 'slow burn', type: 'tv' },
      { name: 'slow burns', type: 'profile' },
      { name: 'posessive love', type: 'warning' },
      { name: 'animal death', type: 'warning' },
      { name: 'comedies', type: 'profile' },
      { name: 'diverse cast', type: 'tv' },
      { name: 'verisimilar', type: 'tv' },
      { name: 'verisimilitude', type: 'profile' },
      { name: 'silly', type: 'tv' },
      { name: 'smart', type: 'tv' },
      { name: 'silliness', type: 'profile' },
      { name: 'some silliness but not too much', type: 'profile' },
      { name: 'give me all the silliness', type: 'unassigned' },
      { name: 'serious', type: 'tv' },
      { name: 'seriousness', type: 'profile' },
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
