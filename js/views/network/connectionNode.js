import Node from "./node.js";

class ConnectionNode {
    /**
     * @param {Node} node 
     * @param {number} weight 
     */
    constructor(node, weight) {
        this.node = node;
        this.weight = weight;
    }
}

export default ConnectionNode;
