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

const io = require("socket.io")(server)

let currentLoggedUsernames = []

let messagesHistory = {
    'main': []
}

io.on('connection', socket => {
    socket.username = `anonymous_${Date.now()}`

    io.to(socket.id).emit('self-username', { username: socket.username })

    if(!currentLoggedUsernames.includes(socket.username)) {
        currentLoggedUsernames.push(socket.username)
    }

    console.log(`[SOCKET] New user with name: ${socket.username} has arrived!`)

    // socket.on('change-username', data => {
    //     socket.username = data.username.substring(0, 25) //Limit the username to N chars
    // })

    socket.on('publish-message', data => {
        console.log(`[SOCKET] New message has been received: ${data.messageContent}`)

        messagesHistory.main.push({ messageContent: data.messageContent, username: socket.username })
        io.sockets.emit('publish-message', { messageContent: data.messageContent, username: socket.username })
    })

    socket.on('fetch-message-history', () => {
        io.to(socket.id).emit('message-history', messagesHistory);
    })

    socket.on('fetch-current-users', () => {
        io.sockets.emit('current-usernames', { usernames: currentLoggedUsernames })
    })

    socket.on('leaving', () => {
        console.log('leaving')

        currentLoggedUsernames = currentLoggedUsernames.filter(item => item !== socket.username)
        io.sockets.emit('current-usernames', { usernames: currentLoggedUsernames })
    })
})