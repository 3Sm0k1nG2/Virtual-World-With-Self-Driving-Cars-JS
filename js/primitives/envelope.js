import { add, angle, subtract, translate } from "../math/utils.js";
import Point from "./point.js";
import Polygon from "./polygon.js";
import Segment from "./segment.js";

class Envelope  {
    /** 
     * @param {Segment} skeleton
     * @param {number} width
     */
    constructor(skeleton, width, roundness = 1){
        this.skeleton = skeleton;
        this.polygon = this.#generatePolygon(width, roundness);
    }

    /** @param {number} width */
    #generatePolygon(width, roundness){
        if(!this.skeleton) {
            return;
        }

        const { p1, p2 } = this.skeleton;
        
        const radius = width / 2;

        const alpha = angle(subtract(p1, p2));
        const alpha_ccw = alpha - Math.PI / 2;
        const alpha_cw = alpha + Math.PI / 2;

        const points = [];
        const step = Math.PI / Math.max(1, roundness);
        const eps = step / 2;
        for(let i = alpha_ccw; i < alpha_cw + eps; i+=step){
            points.push(translate(p1, i, radius))
        }

        for(let i = alpha_ccw; i < alpha_cw + eps; i+=step){
            points.push(translate(p2, Math.PI + i, radius))
        }

        return new Polygon(points);
    }

    /**  
     * @param {CanvasRenderingContext2D} ctx
     * @param {{ fill: string, stroke: string, lineWidth: number} } options
     */
    draw(ctx, options) {
        if(!this.skeleton){
            return;
        }        

        this.polygon.draw(ctx, options);
    }
}

export default Envelope
