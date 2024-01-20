import EventListenerModule from "./eventListenerModule.js";

class EventListenerModuleBuilder {
    /** @type {{[eventName: string]: ((event: MyEvent) => void)[]}} */
    #eventListeners;

    constructor() {
        this.#eventListeners = {};
    }

    /** @param {...string} eventNames */
    registerEvents(...eventNames) {
        for(let eventName of eventNames) {
            this.#eventListeners[eventName] = [];
        }
        
        return this;
    }

    /** @param {...string} eventNames */
    unregisterEvents(...eventNames) {
        for(let eventName of eventNames) {
            delete this.#eventListeners[eventName];
        }

        return this;
    }

    build() {
        const eventListeners = {};
        for(let eventName in this.#eventListeners) {
            eventListeners[eventName] = [...this.#eventListeners[eventName]];
        }

        return new EventListenerModule(eventListeners);
    }

    reset() {
        this.#eventListeners = {};
    }
}

export default EventListenerModuleBuilder;
