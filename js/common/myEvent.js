/** @template T */
class MyEvent {
    /** @param {T} target */
    constructor(target) {
        this.target = target;
    }
}

export default MyEvent;
