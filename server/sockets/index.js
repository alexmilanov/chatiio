const socketManager = require('.//SocketManager')
const storageManagerInstance = require('../storage/index')

module.exports = (serverInstance) => new socketManager(server, storageManagerInstance)