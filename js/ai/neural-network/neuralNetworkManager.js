import { lerp } from "../../views/car/utils.js";
import Level from "./level.js";
import NeuralNetwork from "./network.js";

export class NeuralNetworkManager {
    /** 
     * @param {Level} level
     * @param {any[]} inputs
     */
    feedForwardLevel(level, inputs) {
        for(let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = inputs[i];
        }

        let sum;
        for(let oI = 0; oI < level.outputs.length; oI++) {
            sum = 0;
            for(let iI = 0; iI < level.inputs.length; iI++) {
                sum += level.inputs[iI] * level.weights[iI][oI];
            }

            level.outputs[oI] = sum > level.biases[oI] ? 1 : 0;
        }

        return level.outputs;
    }

    /** 
     * @param {NeuralNetwork} network 
     * @param {any[]} inputs 
     */
    feedForwardNetwork(network, inputs) {
        let outputs = this.feedForwardLevel(network.levels[0],inputs);

        for(let i = 1; i < network.levels.length; i++){
            outputs = this.feedForwardLevel(network.levels[i], outputs);
        }

        return outputs;
    }

    /** 
     * @param {NeuralNetwork} network
     * @param {number} amount
     */
    mutateNetwork(network, amount = 1) {
        for(let level of network.levels) {
            for(let bI in level.biases) {
                level.biases[bI] = lerp(
                    level.biases[bI],
                    Math.random()*2-1,
                    amount
                )
            }

            for(let weights of level.weights) {
                for(let wI in weights) {
                    weights[wI] = lerp(
                        weights[wI],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        }
    }

    /** @param {NeuralNetwork} network */
    cloneNetwork(network) {
        return JSON.parse(JSON.stringify(network));
    }
}

export default NeuralNetworkManager;
