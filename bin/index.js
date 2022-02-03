const { db } = require('../server/db')
const PORT = process.env.PORT ?? 8080
const app = require('../server')
const seed = require('../seed.js')

const init = async () => {
  try {
    console.log('i got this far 1')
    if (process.env.SEED === 'true') {
      console.log('I GOT INTO THIS ONE SEED')
      await seed()
    } else {
      await db.sync()
    }
    // start listening (and create a 'server' object representing our server)
    app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`))
  } catch (ex) {
    console.log(ex)
  }
}

init()
