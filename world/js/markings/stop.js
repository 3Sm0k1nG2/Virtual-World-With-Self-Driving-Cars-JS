import { MARKING_STOP } from "../consts.js";
import { angle } from "../math/utils.js";
import Point from "../primitives/point.js";
import Marking from "./marking.js";

class Stop extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center,directionVector,width,height) {
        super(center, directionVector, width, height);

        this.type = MARKING_STOP;

        this.borders = [this.polygon.segments[2]];
    }

    /** @param {CanvasRenderingContext2D} ctx  */
    draw(ctx) {
        this.borders.forEach(b => b.draw(ctx, { width: 5, color: "white" }));

        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1, 3);

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = this.height * 0.3 + "px Arial"
        ctx.fillText("STOP", 0, 1);

        ctx.restore();
    }
}

export default Stop;
