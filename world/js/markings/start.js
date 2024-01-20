import { MARKING_START } from "../consts.js";
import { angle } from "../math/utils.js";
import Point from "../primitives/point.js";
import Marking from "./marking.js";

class Start extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.type = MARKING_START;

        this.img = new Image();
        this.img.src = "./car.svg";
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);

        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2)

        ctx.restore();
    }
}

export default Start;
