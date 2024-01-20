class RGBA {
    /**
     * @param {number} red 
     * @param {number} green 
     * @param {number} blue 
     * @param {number} alpha 
     */
    constructor(
        red = 0,
        green = 0,
        blue = 0,
        alpha = 1
    ) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    toString() {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
    }
}

export default RGBA;
