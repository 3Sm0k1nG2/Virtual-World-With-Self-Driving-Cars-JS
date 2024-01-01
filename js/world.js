import Graph from "./math/graph.js";
import Envelope from "./primitives/envelope.js";
import Polygon from "./primitives/polygon.js";

class World {
    /**
     * @param {Graph} graph 
     * @param {number} roadWidth 
     * @param {number} roadRoundness 
     */
    constructor(graph, roadWidth = 100, roadRoundness = 3){
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        /** @type {Envelope[]} */
        this.envelopes = [];
        this.roadBorders = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0;

        for(const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg, this.roadWidth, this.roadRoundness)
            );
        }

        if(!this.envelopes.length) {
            return;
        }
        
        this.roadBorders = Polygon.union(this.envelopes.map(env => env.polygon))
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        for (const env of this.envelopes){
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15} );
        }
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: 'white', width: 4, dash: [10, 10]})
        }
        for (const seg of this.roadBorders) {
            seg.draw(ctx, { color : "white", size: 4 });
        }
    }
}

export default World;
