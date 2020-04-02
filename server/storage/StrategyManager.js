class StrategyStorageManager {
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

    
}