import { MARKING_PARKING } from "../consts.js";
import { angle } from "../math/utils.js";
import Marking from "./marking.js";

class Parking extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.type = MARKING_PARKING;

        this.borders = [this.polygon.segments[0], this.polygon.segments[2]];
    }
    
    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.borders.forEach(b => b.draw(ctx, { width: 5, color: "white" }))

        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector));

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold " + this.height * 0.9 + "px Arial";
        ctx.fillText("P", 0, 3);

        ctx.restore();
    }
}

export default Parking;
