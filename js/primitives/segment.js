import DrawParams from "./drawParams.js";

class Segment {
    /**
     * @param {Point} p1 
     * @param {Point} p2
     */
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    /** @param {Segment} segment */
    equals(segment) {
        return this.includes(segment.p1) && this.includes(segment.p2);
    }

    /** @param {Point} point*/
    includes(point) {
        return this.p1.equals(point) || this.p2.equals(point);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {DrawParams} drawParams
     */
    draw(ctx, { size = 2, color = "black", dash = [] } = {}) {
        ctx.beginPath();
        ctx.lineWidth = size;
        ctx.strokeStyle = color;
        ctx.setLineDash(dash);
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

export default Segment;
