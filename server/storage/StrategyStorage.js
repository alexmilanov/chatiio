module.exports = class StrategyStorage {
    #context
    
    constructor(context) {
        this.#context = context
    }

    set context(context) {
        this.#context = context
    }

    get context() {
        return this.#context
    }

    isUsernameInLoggedUsers(username) {
        return this.#context.isUsernameInLoggedUsers(username)
    }

    addLoggedUsername(username) {
        this.#context.addLoggedUsername(username)
    }

    getCurrentLoggedUsernames() {
        return this.#context.getCurrentLoggedUsernames()
    }

    removeLoggedUsername(username) {
        this.#context.removeLoggedUsername(username)
    }

    addHistoryPerRoom(room, history) {
        this.#context.addHistoryPerRoom(room, history)
    }

    historyPerRoomExists(room) {
        return this.#context.historyPerRoomExists(room)
    }

    initHistoryPerRoom(room) {
        this.#context.initHistoryPerRoom(room)
    }

    getHistoryPerRoom(room) {
        return this.#context.getHistoryPerRoom(room)
    }

    addConnectedUserData(username, socketData) {
        this.#context.addConnectedUserData(username, socketData)
    }

    hasConnectedUsername(username) {
        return this.#context.hasConnectedUsername(username)
    }

    getConnectedUserData(username) {
        return this.#context.getConnectedUserData(username)
    }

    hasChatRoom(room) {
        return this.#context.hasChatRoom(room)
    }

    initEmptyRoom(room) {
        this.#context.initEmptyRoom(room)
    }

    addUserPerRoom(room, username) {
        this.#context.addUserPerRoom(room, username)
    }

    massStoreUsersPerRoom(room, users) {
        this.#context.massStoreUsersPerRoom(room, users)
    }
}