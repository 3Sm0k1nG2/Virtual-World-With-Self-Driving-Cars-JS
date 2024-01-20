class OfflineStorage {
    #storageIO;

    /** @param {Storage} storageIO */
    constructor(storageIO) {
        this.#storageIO = storageIO;
    }

    /** 
     * @param {string} key
     * @param {string} data
     */
    store(key, data) {
        this.#storageIO.setItem(key, data);
    }

    /** @param {string} key */
    get(key) {
        return this.#storageIO.getItem(key);
    }

    /** @param {string} key */
    remove(key) {
        this.#storageIO.removeItem(key);
    }
}

export default OfflineStorage;
