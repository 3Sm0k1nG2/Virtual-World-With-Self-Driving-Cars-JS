class Segment {
    /**
     * 
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
    includes(point){
        return this.p1.equals(point) || this.p2.equals(point);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} width 
     * @param {CSSStyleDeclaration.color} color 
     */
    draw(ctx, width = 2, color = "black"){
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(this.p1.x, this.p1.y);
        ctx.lineTo(this.p2.x, this.p2.y);
        ctx.stroke();
    }
}