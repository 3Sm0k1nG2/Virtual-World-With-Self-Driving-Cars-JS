export class Level {
    /**
     * @param {number} inputCount 
     * @param {number} outputCount 
     */
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        
        this.biases = new Array(outputCount);

        this.weights = new Array(inputCount);
        for(let i = 0; i < this.weights.length; i++) {
            this.weights[i] = new Array(inputCount);
        }

        this.#randomizeWeightsAndBiases();
    }

    #randomizeWeightsAndBiases(){
        for(let iI = 0; iI < this.inputs.length; iI++){
            for(let oI = 0; oI < this.outputs.length; oI++){
                this.weights[iI][oI] = Math.random()*2 - 1
            }
        }

        for(let i = 0; i < this.biases.length; i++) {
            this.biases[i] = Math.random()*2 - 1;
        }
    }
}

export default Level;
