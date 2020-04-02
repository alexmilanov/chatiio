const storageType = process.env.STORAGE || 'LocalStorage' //Storage Name should be in camel

const storageContext = require(`./implementations/${storageType}`)
const strategyManager = require('./StrategyStorage')

module.exports = new strategyManager(new storageContext)