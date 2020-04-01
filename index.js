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

let connectedUsers = {}

let privateChatRooms = {}

io.on('connection', socket => {
    socket.username = `anonymous_${Date.now()}`
    socket.room = 'main'
    socket.join(socket.room)

    io.to(socket.id).emit('self-username', { username: socket.username })

    if(!currentLoggedUsernames.includes(socket.username)) {
        currentLoggedUsernames.push(socket.username)
    }

    console.log(`[SOCKET] New user with name: ${socket.username} has arrived!`)

    connectedUsers[socket.username] = socket //Save the whole socket object per username so later I can send some data per specific username

    // socket.on('change-username', data => {
    //     socket.username = data.username.substring(0, 25) //Limit the username to N chars
    // })

    socket.on('publish-message', data => {
        console.log(`[SOCKET] New message has been received: ${data.messageContent}`)

        messagesHistory[socket.room].push({ messageContent: data.messageContent, username: socket.username })
        // socket.broadcast.to(socket.room).emit('publish-message', { messageContent: data.messageContent, username: socket.username })
        io.in(socket.room).emit('publish-message', { messageContent: data.messageContent, username: socket.username })
    })

    socket.on('fetch-message-history', () => {
        io.to(socket.id).emit('message-history', messagesHistory[socket.room])
    })

    socket.on('fetch-current-users', () => {
        io.sockets.emit('current-usernames', { usernames: currentLoggedUsernames })
    })

    socket.on('leaving', () => {
        console.log(`[SOCKET] User ${socket.username} has left the chat`)

        currentLoggedUsernames = currentLoggedUsernames.filter(item => item !== socket.username)
        io.sockets.emit('current-usernames', { usernames: currentLoggedUsernames })
    })

    socket.on('create-private-room', selectedUsers => {
        console.log(`[SOCKET] User ${socket.username} create new private room with users ${selectedUsers.users}`)

        const privateChatRoomName = `room_${Date.now()}`
        
        if(!privateChatRooms.hasOwnProperty(privateChatRoomName)) {
            privateChatRooms[privateChatRoomName] = {}
            privateChatRooms[privateChatRoomName]['users'] = []
        }

        console.log(`[SOCKET] New private room ${privateChatRoomName} has been created`)

        privateChatRooms[privateChatRoomName]['users'] = selectedUsers.users

        //Notify the selected users that they has private messages
        selectedUsers.users.forEach(username => {
            if(connectedUsers.hasOwnProperty(username)) {
                io.to(connectedUsers[username].id).emit('new-message-room', privateChatRoomName)
            }
        })

        io.to(socket.id).emit('new-message-room', privateChatRoomName)
        privateChatRooms[privateChatRoomName]['users'].push(socket.username)

        messagesHistory[privateChatRoomName] = []
    })

    socket.on('join-room', room => {
        socket.join(room.roomName)
        socket.room = room.roomName

        io.to(socket.id).emit('message-history', messagesHistory[socket.room])
    })
})