const Sequelize = require('sequelize')
const pkg = require('../../package.json')

const databaseName = pkg.name

const config = {
  logging: false,
}

if (process.env.DATABASE_URL) {
  config.dialectOptions = {
    ssl: {
      rejectUnauthorized: false,
    },
  }
}

const db = new Sequelize(
  process.env.DATABASE_URL ?? `postgres://localhost:5432/${databaseName}`,
  config
)

try {
  console.log('I GOT HERE TO THIS')
  await sequelize.authenticate()
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}
module.exports = db
