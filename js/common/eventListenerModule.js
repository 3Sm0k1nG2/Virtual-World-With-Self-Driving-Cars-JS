import MyEvent from "./myEvent.js";

class EventListenerModule {
    #eventListeners;
    
    /** @type {{[eventName: string]: ((event: MyEvent) => void)[]}} */
    constructor(eventListeners) {
        this.#eventListeners = eventListeners;
    }

    /** 
     * @param {string} eventName
     * @param {(event?: MyEvent<any>) => void} callback
     */
    addEventListener(eventName, callback) {
        this.#eventListeners[eventName]?.push(callback);
    }

    /** @param {string} eventName */
    dispatchEvent(eventName) {
        this.#eventListeners[eventName]?.forEach( l => { l(); })
    }

    /** @param {string} eventName */
    removeEventListeners(eventName) {
        this.#eventListeners[eventName] = [];
    }
}

export default EventListenerModule;
