import { MARKING_LIGHT, TRAFFIC_LIGHT_GREEN, TRAFFIC_LIGHT_OFF, TRAFFIC_LIGHT_RED, TRAFFIC_LIGHT_YELLOW } from "../consts.js";
import { add, lerp2D, perpendicular, scale } from "../math/utils.js";
import Segment from "../primitives/segment.js";
import Marking from "./marking.js";

class Light extends Marking {
    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(center, directionVector, width, height) {
        super(center, directionVector, width, height);

        this.type = MARKING_LIGHT;

        this.state = TRAFFIC_LIGHT_OFF;
        this.border = this.polygon.segments[0];
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2))
        );

        const green = lerp2D(line.p1, line.p2, 0.2);
        const yellow = lerp2D(line.p1, line.p2, 0.5);
        const red = lerp2D(line.p1, line.p2, 0.8);

        new Segment(red, green).draw(ctx, {
            width: this.height * 0.5,
            cap: "round"
        });

        green.draw(ctx, { size: this.height * 0.6, color: "#060" });
        yellow.draw(ctx, { size: this.height * 0.6, color: "#660" });
        red.draw(ctx, { size: this.height * 0.6, color: "#600" });

        switch (this.state) {
            case TRAFFIC_LIGHT_GREEN:
                green.draw(ctx, { size: this.height * 0.6, color: "#0F0" });
                break;
            case TRAFFIC_LIGHT_YELLOW:
                yellow.draw(ctx, { size: this.height * 0.6, color: "#FF0" });
                break;
            case TRAFFIC_LIGHT_RED:
                red.draw(ctx, { size: this.height * 0.6, color: "#F00" });
                break;
        }
    }
}

export default Light;
