class DrawParams {
    /**
     * @param {number} size 
     * @param {CSSStyleDeclaration.color} color 
     * @param {boolean} outline 
     * @param {boolean} fill 
     * @param {number[]} dash
     */
    constructor(size, color, outline, fill, dash){
        this.size = size;
        this.color = color;
        this.outline = outline;
        this.fill = fill;
        this.dash = [...dash];
    }
}

export default DrawParams;
