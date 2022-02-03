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
console.log('DATABASE URL', process.env.DATABASE_URL)

const db = new Sequelize(
  process.env.DATABASE_URL ?? `postgres://localhost:5432/${databaseName}`
)

module.exports = db
