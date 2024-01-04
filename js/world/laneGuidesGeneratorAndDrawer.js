import Envelope from "../primitives/envelope.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";

class LaneGuidesGeneratorAndDrawer {
    constructor() {
        /** @type {Segment[]} */
        this.laneGuides = [];
    }

    /** 
     * @param {Segment[]} graphSegments
     * @param {number} roadWidth
     * @param {number} roadRoundness
     */
    #generateInitialEnvelopes(graphSegments = [], roadWidth, roadRoundness) {
        const initials = [];

        for(let seg of graphSegments) {
            initials.push(
                new Envelope(
                    seg,
                    roadWidth / 2,
                    roadRoundness
                )
            )
        }

        return initials;
    }

    /** 
     * @param {Segment[]} graphSegments
     * @param {number} roadWidth
     * @param {number} roadRoundness
     */
    generate(graphSegments, roadWidth, roadRoundness) {
        this.laneGuides.length = 0;

        if(!graphSegments?.length){
            return;
        }

        const initials = this.#generateInitialEnvelopes(
            graphSegments,
            roadWidth,
            roadRoundness
        );

        const segments = Polygon.union(initials.map(e => e.polygon));

        this.laneGuides.push(...segments);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.laneGuides.forEach(s => s.draw(ctx, {color: "red"}));
    }
}

export default LaneGuidesGeneratorAndDrawer;
