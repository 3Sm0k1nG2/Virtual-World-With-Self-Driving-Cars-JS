import { carEventTypes } from "./views/car/carEvents.js";
import EventListenerModule from "./common/eventListenerModule.js"
import MyEvent from "./common/myEvent.js";

class Car {
    #eventListenerModule;

    /** @param {EventListenerModule} eventListenerModule */
    constructor(eventListenerModule) {
        this.#eventListenerModule = eventListenerModule;
    }

    /** 
     * @param {keyof carEventTypes} eventName
     * @param {(event?: MyEvent<Car>) => void} callback
     */
    addEventListener(eventName, callback) {
        this.#eventListenerModule.addEventListener(
            eventName,
            callback.bind(null, new CarEvent(this))
        );
    }

    /** @param {keyof carEventTypes} eventName */
    removeEventListeners(eventName) {
        this.#eventListenerModule.removeEventListeners(eventName);
    }

    /** @param {keyof carEventTypes} eventName */
    dispatchEvent(eventName) {
        this.#eventListenerModule.dispatchEvent(eventName);
    }
}

class CarEvent {
    constructor(car) {
        this.target = car; 
    }
}

// const aiTrainer = new CarAITrainer(
//     new AITrainerSubjectManager(),
//     100
// );

// console.log(aiTrainer.carSubjects[0]);
// aiTrainer.simulateCrash(aiTrainer.carSubjects[0]);
// console.log(aiTrainer.carSubjects[0]);

// const carEvents = {
//     oncrash: CarEvent
// }

// const crash = (e) => {
//     console.log("CRASH - 1")
//     console.log(e);
// }

// const eventListenerModuleBuilder = new EventListenerModuleBuilder();
// eventListenerModuleBuilder.registerEvents(...Object.keys(carEvents));

// /** @type {Collection<Car>} */
// const collection = new Collection();
// console.log(collection);
// collection.add(new CollectionItem(new Car(eventListenerModuleBuilder.build())));
// collection.add(new CollectionItem(new Car(eventListenerModuleBuilder.build())));
// collection.get(0).value.addEventListener("oncrash", (e) => {
//     console.log("CRASH - 0")
//     console.log(e);
// })
// collection.get(0).value.addEventListener("oncrash", crash)
// collection.get(0).value.dispatchEvent('oncrash');

// collection.get(1).value.addEventListener("oncrash", crash)
// collection.get(1).value.dispatchEvent('oncrash');

// collection.get(0).value.removeEventListeners('oncrash');
// collection.get(1).value.removeEventListeners('oncrash');
// collection.get(0).value.dispatchEvent('oncrash');
// collection.get(1).value.dispatchEvent('oncrash');

// console.log(collection);
