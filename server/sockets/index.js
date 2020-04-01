const socketManager = require('.//SocketManager')
const storageManagerInstance = require('../storage/StorageManager')

module.exports = (serverInstance) => new socketManager(server, storageManagerInstance)