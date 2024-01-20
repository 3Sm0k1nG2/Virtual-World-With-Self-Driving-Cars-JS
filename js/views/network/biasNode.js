import Node from "./node.js";

class BiasNode {
    /**
     * @param {Node} node 
     * @param {number} bias 
     */
    constructor(node, bias) {
        this.node = node;
        this.bias = bias;
    }
}

export default BiasNode;
