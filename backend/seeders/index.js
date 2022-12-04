const usersSeeder = require('./usersSeeder')
const servicesSeeder = require('./servicesSeeder')

const seed = () => {
    usersSeeder.seedUsers()
    servicesSeeder.seedServices()
}

module.exports = {
    seed
}