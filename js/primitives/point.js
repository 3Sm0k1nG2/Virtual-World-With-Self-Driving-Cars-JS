import DrawParams from "./drawParams.js";

class Point {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** @param {Point} point */
    equals(point) {
        return this.x === point.x
            && this.y === point.y;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {DrawParams} drawParams
     */
    draw(ctx, { size = 18, color = 'black', outline = false, fill = false } = {}) {
        const rad = size / 2;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        ctx.fill();

        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, rad * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }

        if(fill) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, rad * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
    }
}

export default Point;
