import { add, perpendicular, scale } from "../math/utils.js";
import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";
import Marking from "./marking.js";

class Crossing extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center,directionVector,width,height) {
        super(center, directionVector, width, height);

        this.borders = [this.polygon.segments[0], this.polygon.segments[2]]
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.borders.forEach(b => b.draw(ctx, { width: this.width * 0.025, color: "white" }));

        const perp = perpendicular(this.directionVector);

        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        )

        line.draw(ctx, {
            width: this.height,
            color: "white",
            dash: [this.width * 0.0775],
        });
    }
}

export default Crossing;
