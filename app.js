require('dotenv').config() //Configure the dotenv 

const express = require("express")
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render("index.html")
})

const port = process.env.PORT || 3000

server = app.listen(port, () => {
    console.log('[SERVER] Successfully started...')
    console.log(`[SERVER] Listen on port: ${port}...`)
}) //ToDo move those vars to env file

const socketManager = require('./server/sockets/SocketManager')
const storageManagerInstance = require('./server/storage/StorageManager')
//const storageManagerInstance = new storageManager
new socketManager(server, storageManagerInstance)