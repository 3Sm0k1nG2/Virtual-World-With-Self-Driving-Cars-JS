import { add, lerp, lerp2D, scale, subtract, translate } from "../math/utils.js";
import Point from "../primitives/point.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";

class Tree {
    /**
     * @param {Point} center 
     * @param {number} size 
     */
    constructor(center, size, heightCoef = 0.3) {
        this.center = center;
        this.size = size;
        this.heightCoef = heightCoef;

        this.base = this.#generateLevel(center, size);
    }

    /** @param {Tree} rawData */
    static load(rawData){
        return new Tree(rawData.center, rawData.size, rawData.heightCoef);
    }

    /**
     * 
     * @param {Point} point 
     * @param {number} size 
     */
    #generateLevel(point, size) {
        const points = [];
        const radius = size / 2;

        let noisyRadius = undefined;
        let kingOfRandom = undefined;
        for(let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16){
            kingOfRandom = Math.cos(((angle + this.center.x) * size) % 17) ** 2;
            noisyRadius = radius * lerp(0.5, 1, kingOfRandom);
            points.push(translate(point, angle, noisyRadius));
        }

        return new Polygon(points);
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
        const diff = subtract(this.center, viewPoint);
        const top = add(this.center, scale(diff, this.heightCoef));
        
        const levelCount = 7;
        let t = undefined;
        let color = undefined;
        let size = undefined;
        let point = null;
        let polygon = null;
        for(let level = 0; level < levelCount; level++){
            t = level / (levelCount - 1);
            point = lerp2D(this.center, top, t);
            color = "rgb(30," + lerp(50, 200, t) + ", 70)";
            size = lerp(this.size, this.size*0.2, t);
            polygon = this.#generateLevel(point, size);
            polygon.draw(ctx, { stroke: "rgba(0,0,0,0)", fill: color });
        }

    }
}

export default Tree;
