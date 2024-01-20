import CollectionItem from "./collectionItem.js";

/** @template T */
class Collection {
    /** @type {CollectionItem<T>[]} */
    #items
    /** @type {{[itemId: string]: number}} */
    #itemIndexDictionary;
    
    constructor() {
        this.#items = [];
        this.#itemIndexDictionary = {};
    }

    /** @returns {ReadonlyArray<CollectionItem<T>>} */
    get items() {
        return this.#items;
    } 

    /** @param {CollectionItem<T>} item */
    add(item) {
        this.#items.push(item);

        this.#itemIndexDictionary[item.key] = this.#items.length-1;
    }

    /** @param {CollectionItem<T>} item */
    remove(item) {
        this.#items.splice(
            this.#items.indexOf(this.#itemIndexDictionary[item.key]),
            1
        );

        delete this.#itemIndexDictionary[item];
    }

    /** @param {number} index */
    get(index) {
        return this.#items[index];
    }
}

export default Collection;
