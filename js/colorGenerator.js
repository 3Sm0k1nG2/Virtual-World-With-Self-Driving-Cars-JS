import RGBA from "./views/common/rgba.js";
import HSLA from "./views/common/hsla.js";

class ColorGenerator {
    /**
     * @param {number} red 0 - 255 
     * @param {number} green 0 - 255
     * @param {number} blue 0 - 255
     * @param {number} alpha Fraction 0 - 1 
     */
    generateRGBA(red, green, blue, alpha = 1) {
        return new RGBA(red, green, blue, alpha);
    }

    /**
     * @param {number} hue 0 - 359
     * @param {number} saturation Fraction 0 - 1
     * @param {number} lightness Fraction 0 - 1
     * @param {number} alpha Fraction 0 - 1 
     */
    generateHSLA(hue, saturation, lightness, alpha = 1) {
        return new HSLA(hue, saturation, lightness, alpha);
    }

    /**
     * @param {number} saturation Fraction 0 - 1
     * @param {number} lightness Fraction 0 - 1
     * @param {number} alpha Fraction 0 - 1 
     */
    random(saturation = 1, lightness = 0.6, alpha = 1) {
        const hue = 290 + Math.random() * 260;
        
        return this.generateHSLA(hue, saturation, lightness, alpha);
    }
}

export default ColorGenerator;
