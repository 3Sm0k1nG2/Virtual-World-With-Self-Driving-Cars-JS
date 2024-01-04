class DrawOptions {
    /**
     * @param {number} width 
     * @param {CSSStyleDeclaration.color} color 
     * @param {boolean} outline 
     * @param {boolean} fill 
     * @param {number[]} dash
     * @param {number} alpha
     * @param {string} cap
     */
    constructor(){
        this.width = 1;
        this.color = "white";
        this.outline = false;
        this.fill = false;
        this.dash = [];
        this.alpha = 1;
        this.cap = "butt";
    }
}

export default DrawOptions;
