import Collection from "../common/collection.js"
import CollectionItem from "../common/collectionItem.js"

/** @template T */
class AITrainerSubjectManager {
    /** @param {Collection<T>} subjects */
    constructor(subjects) {
        this.subjects = subjects;
    }

    /** @param {T} object */
    createSubject(object) {
        return new CollectionItem(object);
    }
}

export default AITrainerSubjectManager;
