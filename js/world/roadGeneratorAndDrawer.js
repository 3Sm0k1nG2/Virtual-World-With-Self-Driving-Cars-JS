import Graph from "../math/graph.js";
import Envelope from "../primitives/envelope.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";

class RoadGeneratorAndDrawer {
    /**
     * @param {number} roadWidth 
     * @param {number} roadRoundness 
     */
    constructor(roadWidth, roadRoundness) {
        this.width = roadWidth;
        this.roundness = roadRoundness;
        
        /** @type {Segment[]} */
        this.pointToPointSegments = [];
        /** @type {Envelope[]} */
        this.roadEnvelopes = [];
        /** @type {Segment[]} */
        this.roadBorders = [];
    }

    /** @param {Graph} graph */
    generate(graph) {
        this.pointToPointSegments = graph.segments;

        this.roadEnvelopes.length = 0;

        for(const seg of graph.segments) {
            this.roadEnvelopes.push(
                new Envelope(seg, this.width, this.roundness)
            );
        }

        // if(this.roads?.length){
            this.roadBorders = Polygon.union(this.roadEnvelopes.map(env => env.polygon))
        // }
    }

    /** @param {CanvasRenderingContext2D} ctx */
    #drawBorders(ctx) {
        this.roadBorders.forEach(b => b.draw(ctx, { color : "white", size: 4 }))
    }

    /** @param {CanvasRenderingContext2D} ctx */
    #drawRoads(ctx) {
        this.roadEnvelopes.forEach(s => s.draw(ctx, { fill: "#BBB", stroke: "#BBB", width: 15, alpha: 1} ))
    }

    /** @param {CanvasRenderingContext2D} ctx */
    #drawRoadSurfaceMarkings(ctx) {
        this.pointToPointSegments.forEach(s => s.draw(ctx, { color: '#ffffff', width: 10, dash: [10, 10], alpha: 1 }))
    }

    /** @param {CanvcasRenderingContext2D} ctx */
    #drawDebug(ctx){
        this.roadEnvelopes.forEach(s => s.draw(ctx));
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {boolean} debug
     */
    draw(ctx, debug = false) {
        this.#drawRoads(ctx);
        this.#drawRoadSurfaceMarkings(ctx);
        if(debug){
            this.#drawDebug(ctx);
        }
        this.#drawBorders(ctx);

    }
}

export default RoadGeneratorAndDrawer;
