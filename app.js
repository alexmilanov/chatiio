require('dotenv').config()

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
})

require('./server/sockets/index')(server)