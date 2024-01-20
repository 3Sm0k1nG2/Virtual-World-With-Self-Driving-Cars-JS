import Border from "./border.js";
import Point from "./point.js";

class Polygon {
    /** @param {Point[]} points */
    constructor(points = []) {
        this.points = points;
    }

    get borders() {
        const firstPoint = this.points[0];

        if(this.points.length <= 1) {
            return [];
        }

        const borders = [];

        for(let i = 1; i < this.points.length; i++){
            borders.push(new Border(this.points[i-1], this.points[i]));
        }

        borders.push(new Border(this.points[this.points.length-1], firstPoint));

        return borders;
    }
}

export default Polygon;
