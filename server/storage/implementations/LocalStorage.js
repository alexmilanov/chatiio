module.exports = class LocalStorage {
    #currentLoggedUsernames = []
    #messagesHistory = {
        'main': []
    }
    #connectedUsers = {}
    #privateChatRooms = {}

    isUsernameInLoggedUsers(username) {
        return this.#currentLoggedUsernames.includes(username)
    }

    addLoggedUsername(username) {
        this.#currentLoggedUsernames.push(username)
    }

    getCurrentLoggedUsernames() {
        return this.#currentLoggedUsernames
    }

    removeLoggedUsername(username) {
        this.#currentLoggedUsernames = this.#currentLoggedUsernames.filter(item => item !== username) 
    }

    addHistoryPerRoom(room, history) {
        if(!this.historyPerRoomExists(room)) {
            this.initHistoryPerRoom(room)
        }

        this.#messagesHistory[room].push(history)
    }

    historyPerRoomExists(room) {
        return this.#messagesHistory.hasOwnProperty(room)
    }

    initHistoryPerRoom(room) {
        this.#messagesHistory[room] = []
    }

    getHistoryPerRoom(room) {
        if(!this.historyPerRoomExists(room)) return []

        return this.#messagesHistory[room]
    }

    addConnectedUserData(username, socketData) {
        this.#connectedUsers[username] = socketData
    }

    hasConnectedUsername(username) {
        return this.#connectedUsers.hasOwnProperty(username)
    }

    getConnectedUserData(username) {
        if(!this.hasConnectedUsername(username)) return

        return this.#connectedUsers[username]
    }

    hasChatRoom(roomName) {
        return this.#privateChatRooms.hasOwnProperty(roomName)
    }

    initEmptyRoom(roomName) {
        if(!this.hasChatRoom(roomName)) {
            this.#privateChatRooms[roomName] = {}
            this.#privateChatRooms[roomName]['users'] = []
        }
    }

    addUserPerRoom(roomName, username) {
        this.#privateChatRooms[roomName].users.push(username)
    }

    massStoreUsersPerRoom(roomName, users) {
        this.#privateChatRooms[roomName].users = users
    }
}
