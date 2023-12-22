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
    equals(point){
        return this.x === point.x
            && this.y === point.y;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} size 
     * @param {CSSStyleDeclaration.color} color 
     */
    draw(ctx, size = 18, color = "black"){
        const rad = size / 2;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, rad, 0, Math.PI * 2);
        ctx.fill();
    }
}