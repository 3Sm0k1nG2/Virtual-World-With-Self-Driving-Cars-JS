import { add, distance, dot, magnitude, normalize, scale, subtract } from "../math/utils.js";
import DrawOptions from "./drawOptions.js";

class Segment {
    /**
     * @param {Point} p1 
     * @param {Point} p2
     */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    /** @param {Segment} rawData */
    static load(rawData) {
        return new Segment(rawData.p1, rawData.p2);
    }

    get length() {
        return distance(this.p1, this.p2);
    }

    get directionVector() {
        return normalize(subtract(this.p2, this.p1));
    }

    /** @param {Segment} segment */
    equals(segment) {
        return this.includes(segment.p1) && this.includes(segment.p2);
    }

    /** @param {Point} point*/
    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    /** @param {Point} point*/
    distanceToPoint(point) {
        const proj = this.projectPoint(point);
        if(proj.offset > 0 && proj.offset < 1){
            return distance(point, proj.point);
        }

        const distToP1 = distance(point, this.p1);
        const distToP2 = distance(point, this.p2);
        return Math.min(distToP1, distToP2);
    }

    /** @param {Point} point*/
    projectPoint(point) {
        const a = subtract(point, this.p1);
        const b = subtract(this.p2, this.p1);
        
        const normB = normalize(b);
        const scaler = dot(a, normB);
        
        const proj = {
            point: add(this.p1, scale(normB, scaler)),
            offset: scaler / magnitude(b)
        };

        return proj;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {DrawOptions} drawOptions
     */
    draw(ctx, { width = 2, color = "black", dash = [], alpha = 1, cap = "butt" } = {}) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineCap = cap;
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

export default Segment;
