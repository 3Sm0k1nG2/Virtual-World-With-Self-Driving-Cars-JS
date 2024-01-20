import Level from "./level.js"

export class NeuralNetwork {
    /**  @param {number[]} neuronCounts */
    constructor(neuronCounts) {
        this.levels = [];
        for(let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(
                neuronCounts[i],
                neuronCounts[i+1]
            ));
        }
    }
}

export default NeuralNetwork;
