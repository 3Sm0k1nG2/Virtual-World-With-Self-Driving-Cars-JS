class HSLA {
    /**
     * @param {number} hue 0 - 359 
     * @param {number} saturation Fraction 0 - 1
     * @param {number} lightness Fraction 0 - 1
     * @param {number} alpha Fraction 0 - 1
     */
    constructor(
        hue = 0,
        saturation = 0,
        lightness = 1,
        alpha = 1
    ) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        this.alpha = alpha;
    }

    toString() {
        return `hsla(${this.hue},${this.saturation*100}%,${this.lightness*100}%,${this.alpha})`;
    }
}

export default HSLA;
