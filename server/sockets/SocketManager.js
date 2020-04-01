const socketIO = require("socket.io")

module.exports = class SocketManager {
    #io

    constructor(serverInstance, storageInstance) {
        this.#io = socketIO(serverInstance)

        this.run(storageInstance)
    }

    run(storageInstance) {
        this.#io.on('connection', socket => {
            socket.username = `anonymous_${Date.now()}`
            socket.room = 'main'
            socket.join(socket.room)
        
            this.#io.to(socket.id).emit('self-username', { username: socket.username })
        
            if(!storageInstance.isUsernameInLoggedUsers(socket.username)) {
                storageInstance.addLoggedUsername(socket.username)
            }
        
            console.log(`[SOCKET] New user with name: ${socket.username} has arrived!`)
         
            storageInstance.addConnectedUserData(socket.username, socket) //Save the whole socket object per username so later I can send some data per specific username
        
            socket.on('publish-message', data => {
                console.log(`[SOCKET] New message has been received: ${data.messageContent}`)
        
                storageInstance.addHistoryPerRoom(socket.room, { messageContent: data.messageContent, username: socket.username })
                this.#io.in(socket.room).emit('publish-message', { messageContent: data.messageContent, username: socket.username })
            })
        
            socket.on('fetch-message-history', () => {
                this.#io.to(socket.id).emit('message-history', storageInstance.getHistoryPerRoom(socket.room))
            })
        
            socket.on('fetch-current-users', () => {
                this.#io.sockets.emit('current-usernames', { usernames: storageInstance.getCurrentLoggedUsernames() })
            })
        
            socket.on('leaving', () => {
                console.log(`[SOCKET] User ${socket.username} has left the chat`)
        
                storageInstance.removeLoggedUsername(socket.username)
                this.#io.sockets.emit('current-usernames', { usernames: storageInstance.getCurrentLoggedUsernames() })
            })
        
            socket.on('create-room', selectedUsers => {
                console.log(`[SOCKET] User ${socket.username} create new private room with users ${selectedUsers.users}`)
        
                const privateChatRoomName = `room_${Date.now()}`

                storageInstance.initEmptyRoom(privateChatRoomName)
        
                console.log(`[SOCKET] New private room ${privateChatRoomName} has been created`)
                
                storageInstance.massStoreUsersPerRoom(privateChatRoomName, selectedUsers.users)
        
                //Notify the selected users that they has private messages
                selectedUsers.users.forEach(username => {
                    this.#io.to(storageInstance.getConnectedUserData(username).id).emit('new-message-room', privateChatRoomName)
                })
        
                this.#io.to(socket.id).emit('new-message-room', privateChatRoomName)

                storageInstance.addUserPerRoom(privateChatRoomName, socket.username)
        
                storageInstance.initHistoryPerRoom(privateChatRoomName)
            })
        
            socket.on('join-room', room => {
                socket.leave(socket.room)
                socket.join(room.roomName)
                socket.room = room.roomName
        
                this.#io.to(socket.id).emit('message-history', storageInstance.getHistoryPerRoom(socket.room))
            })
        })
    }
}