import Car from "./views/car/car.js";
import NeuralNetwork from "./ai/neural-network/network.js";
import NeuralNetworkManager from "./ai/neural-network/neuralNetworkManager.js"
import Storage from "./offlineStorage.js";

class AIManager {
    #saved;
    /** @type {NeuralNetwork} */
    #bestBrain;
    #bestBrainStorageKey;

    /**
     * @param {NeuralNetworkManager} neuralNetworkManager 
     * @param {Storage} storage 
     */
    constructor(
        neuralNetworkManager,
        storage
    ) {
        this.neuralNetworkManager = neuralNetworkManager;
        this.storage = storage;
        
        this.#saved = false; 
        this.#bestBrain = null;
        this.#bestBrainStorageKey = "bestBrain";

        this.restoreBestBrain();
    }


    get bestBrain() {
        return this.#bestBrain;
    }

    get saved() {
        return this.#saved;
    }

    /** @param {NeuralNetwork} brain */
    changeBrain(brain) {
        this.#bestBrain = brain;
        
        this.#saved = false;
    }

    clearBrain() {
        this.#bestBrain = null;

        this.#saved = false;
    }


    storeBestBrain() {
        this.storage.store(
            this.#bestBrainStorageKey,
            JSON.stringify(this.#bestBrain)
        );

        this.#saved = true;
    }

    restoreBestBrain() {
        this.#bestBrain = JSON.parse(this.storage.get(this.#bestBrainStorageKey))
        
        this.#saved = true;
    }

    removeBestBrain() {
        this.storage.remove(this.#bestBrainStorageKey);

        this.#saved = false;
    }

    /** @param {Car[]} cars */
    #findBestCarY(cars) {
        const highestY = Math.min(...cars.map(c => c.y));
        return cars.find(c => c.y === highestY);
    }

    /** @param {Car[]} cars */
    findBestCar(cars) {
        return this.#findBestCarY(cars);
    }

    /** @param {Car[]} cars */
    mutateCars(cars, mutator) {
        const bestCar = cars[0];
        bestCar.brain = this.neuralNetworkManager.cloneNetwork(this.#bestBrain);

        for(let i = 1; i < cars.length; i++) {
            cars[i].brain = this.neuralNetworkManager.cloneNetwork(this.#bestBrain);
            this.neuralNetworkManager.mutateNetwork(cars[i].brain, mutator);
        }
    }
}

export default AIManager;
