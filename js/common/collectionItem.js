/** @template T */
class CollectionItem {
    #key;

    static #trackingKey = -1;

    /** @param {T} value */
    constructor(value) {
        this.#key = ++CollectionItem.#trackingKey;
        
        this.value = value;
    }

    get key() {
        return this.#key;
    }
}

export default CollectionItem;
