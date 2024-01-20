class Point {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    /** @param {Point} point */
    isEquals(point){
        return this.x === point.x && this.y === point.y;
    }
}

export default Point;
