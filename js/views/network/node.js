import Pos from "./pos.js"

class Node {
    /**
     * @param {Pos} pos 
     * @param {number} value 
     */
    constructor(pos, value) {
        this.pos = pos;
        this.value = value;
    }
}

export default Node;
