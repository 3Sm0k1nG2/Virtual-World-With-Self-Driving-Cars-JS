class StorableItem {
    #value;
    #saved;

    /** 
     * @param {string} key
     * @param {any} value
     */
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }

    set value(val) {
        this.#value = val;

        this.#saved = false;
    }

    get value() {
        return this.#value;
    }

    get saved() {
        return this.#saved;
    }

    store() {
        localStorage.setItem(this.key, JSON.stringify(this.value));
        
        this.#saved = true;
    }

    refresh() {
        this.value = JSON.parse(localStorage.getItem(this.key));
    }

    remove() {
        localStorage.removeItem(this.key);
        
        this.value = null;
    }
}

export default StorableItem;
