const { db } = require('../server/db')
const PORT = process.env.PORT ?? 8080
const app = require('../server')
const seed = require('../seed.js')

const init = async () => {
  try {
    console.log('I GOT HERE TO THIS')
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
  //   if (process.env.SEED === 'true') {
  //     await seed();
  //   } else {
  //     await db.sync();
  //   }
  //   // start listening (and create a 'server' object representing our server)
  //   app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
  //  catch (ex) {
  //     console.log(ex);
  //   }
}

init()
