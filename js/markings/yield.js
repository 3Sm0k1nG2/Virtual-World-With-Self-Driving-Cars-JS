import { angle } from "../math/utils.js";
import Marking from "./marking.js";

class Yield extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.border = this.polygon.segments[2];
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.border.draw(ctx, { width: 5, color: "white" });
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1, 3);

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.3 + "px Arial";
        ctx.fillText("YIELD", 0, 1);

        ctx.restore();
    }
}

export default Yield;
