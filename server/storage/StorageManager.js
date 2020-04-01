module.exports = class StorageManager {
    static #currentLoggedUsernames = []

    static function hasUsername(username) {
        return StorageManager.#currentLoggedUsernames.includes(username)
    }

    static function addLoggedUsername(username) {
        StorageManager.#currentLoggedUsernames.push(username)
    }

    static function getCurrentLoggedUsernames() {
        return StorageManager.#currentLoggedUsernames
    }

}