module.exports = class StorageManager {
    static #currentLoggedUsernames = []
    static #messagesHistory = {
        'main': []
    }
    static #connectedUsers = {}
    static #privateChatRooms = {}

    static isUsernameInLoggedUsers(username) {
        return StorageManager.#currentLoggedUsernames.includes(username)
    }

    static addLoggedUsername(username) {
        StorageManager.#currentLoggedUsernames.push(username)
    }

    static getCurrentLoggedUsernames() {
        return StorageManager.#currentLoggedUsernames
    }

    static removeLoggedUsername(username) {
        StorageManager.#currentLoggedUsernames = StorageManager.#currentLoggedUsernames.filter(item => item !== username) 
    }

    static addHistoryPerRoom(room, history) {
        if(!StorageManager.historyPerRoomExists(room)) {
            StorageManager.initHistoryPerRoom(room)
        }

        StorageManager.#messagesHistory[room].push(history)
    }

    static historyPerRoomExists(room) {
        return StorageManager.#messagesHistory.hasOwnProperty(room)
    }

    static initHistoryPerRoom(room) {
        StorageManager.#messagesHistory[room] = []
    }

    static getHistoryPerRoom(room) {
        if(!StorageManager.historyPerRoomExists(room)) return []

        return StorageManager.#messagesHistory[room]
    }

    static addConnectedUserData(username, socketData) {
        StorageManager.#connectedUsers[username] = socketData
    }

    static hasConnectedUsername(username) {
        return StorageManager.#connectedUsers.hasOwnProperty(username)
    }

    static getConnectedUserData(username) {
        if(!StorageManager.hasConnectedUsername(username)) return

        return StorageManager.#connectedUsers[username]
    }

    static hasChatRoom(roomName) {
        return StorageManager.#privateChatRooms.hasOwnProperty(roomName)
    }

    static initEmptyRoom(roomName) {
        if(!StorageManager.hasChatRoom(roomName)) {
            StorageManager.#privateChatRooms[roomName] = {}
            StorageManager.#privateChatRooms[roomName]['users'] = []
        }
    }

    static addUserPerRoom(roomName, username) {
        StorageManager.#privateChatRooms[roomName].users.push(username)
    }

    static massStoreUsersPerRoom(roomName, users) {
        StorageManager.#privateChatRooms[roomName].users = users
    }
}
