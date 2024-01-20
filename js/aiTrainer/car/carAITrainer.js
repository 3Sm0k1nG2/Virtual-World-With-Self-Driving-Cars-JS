import NeuralNetworkManager from "../../ai/neural-network/neuralNetworkManager.js";
import Car from "../../views/car/car.js";
import TrainingSubject from "../trainingSubject.js";

class CarAITrainer {
    /** @param {Car[]} cars */
    constructor(cars) {
        /** @type {{[subjectId: string]: TrainingSubject<Car>}} */
        this.subjects = {};
        
        const subjects = cars.map((car, i) => new TrainingSubject(i, car));
        subjects.forEach(subject => {
            this.subjects[subject.id] = subject
        });
        
        this.bestSubject = subjects[0]; 

        this.#addEventListeners();
    }
    

    #addEventListeners() {
        for(let subjectId in this.subjects) {
            this.subjects[subjectId].object.addEventListener(
                "oncrash",
                this.#onCarCrash.bind(this.subjects[subjectId], this)
            )
        }
    }
    /** 
     * @this {TrainingSubject<Car>}
     * @param {CarAITrainer} aiTrainer
     */
    #onCarCrash(aiTrainer) {
        delete aiTrainer.subjects[this.id];
    }

    #updateBestCarByY() {
        for(let subjectId in this.subjects){
            if(this.subjects[subjectId].object.y < this.bestSubject.object.y) {
                this.bestSubject = this.subjects[subjectId];
            }
        }
    }

    refreshBestSubject() {
        this.#updateBestCarByY();
    }

    /**
     * @param {NeuralNetworkManager} neuralNetworkManager 
     * @param {number} mutator 0 - 1 Fraction
     */
    mutateCars(neuralNetworkManager, mutator) {
        for(let subjectId in this.subjects){
            this.subjects[subjectId].object.brain = neuralNetworkManager.cloneNetwork(this.bestSubject.object.brain);
            neuralNetworkManager.mutateNetwork(this.subjects[subjectId].object.brain, mutator);
        }
    }

    /** @param {TrainingSubject<Car>} subject */
    simulateCrash(subject) {
        subject.object.dispatchEvent('oncrash');
    }
}

export default CarAITrainer;
