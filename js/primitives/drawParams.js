class DrawParams {
    /**
     * @param {number} size 
     * @param {CSSStyleDeclaration.color} color 
     * @param {boolean} outline 
     * @param {boolean} fill 
     * @param {number[]} dash
     */
    constructor(){
        this.size = 1;
        this.color = "white";
        this.outline = false;
        this.fill = false;
        this.dash = [];
    }
}

export default DrawParams;
