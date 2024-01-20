import { MARKING_TARGET } from "../consts.js";
import Marking from "./marking.js";

class Target extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.type = MARKING_TARGET;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.center.draw(ctx, { color: "red", size: 30 });
        this.center.draw(ctx, { color: "white", size: 20 });
        this.center.draw(ctx, { color: "red", size: 10 });
    }
}

export default Target;
