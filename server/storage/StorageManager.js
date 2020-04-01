module.exports = class StorageManager {
    static #currentLoggedUsernames = []

    static hasUsername(username) {
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
}
