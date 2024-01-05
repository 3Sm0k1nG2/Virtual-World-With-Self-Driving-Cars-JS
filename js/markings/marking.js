import { angle, translate } from "../math/utils.js";
import Envelope from "../primitives/envelope.js";
import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";

class Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center,directionVector,width,height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.type = undefined;

        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2),
        );

        this.polygon = new Envelope(
            this.support,
            width,
            0
        ).polygon;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.polygon.draw(ctx);
    }
}

export default Marking;
