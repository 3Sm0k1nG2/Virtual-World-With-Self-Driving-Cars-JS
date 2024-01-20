import Node from "./node.js";
import ConnectionNode from "./connectionNode.js";

class Connection {
    /**
     * @param {Node} node 
     * @param {Node[]} nodesToConnect 
     * @param {number[]} nodesWeights 
     */
    constructor(
        node,
        nodesToConnect,
        nodesWeights
    ) {
        this.node = node;
        this.connectedNodes = nodesToConnect.map((node, i) => new ConnectionNode(node, nodesWeights[i]));
    }
}

export default Connection;
