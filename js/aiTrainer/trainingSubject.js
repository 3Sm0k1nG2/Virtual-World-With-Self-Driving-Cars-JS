/** @template T */
class TrainingSubject {
    #id
    #object

    /**
     * @param {string} id 
     * @param {T} object 
     */
    constructor(id, object) {
        this.#id = id;
        this.#object = object;
    }

    get id() {
        return this.#id;
    }

    get object(){
        return this.#object
    } 
}

export default TrainingSubject;
