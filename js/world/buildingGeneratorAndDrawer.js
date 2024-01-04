import Building from "../items/building.js";
import Graph from "../math/graph.js";
import { add, scale } from "../math/utils.js";
import Envelope from "../primitives/envelope.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";

class BuildingGeneratorAndDrawer {
    /**
     * @param {number} buildingWidth 
     * @param {number} buildingMinLength 
     * @param {number} betweenBuildingSpacing 
     */
    constructor(
        buildingWidth,
        buildingMinLength,
        betweenBuildingSpacing
    ) {
        this.width = buildingWidth;
        this.minLength = buildingMinLength;
        this.spacing = betweenBuildingSpacing;

        /** @type {Building[]} */
        this.buildings = [];
    }

    /** 
     * @param {Graph} graph
     * @param {number} roadWidth
     * @param {number} roundness
     */
    generate(graph, roadWidth, roundness) {
        this.buildings.length = 0;
        
        if(!graph.segments?.length){
            return;
        }

        const initials = this.#generateInitialEnvelopes(
            graph.segments,
            roadWidth,
            roundness
        );
        const guides = this.#generatePartialGuides(initials);
        const supports = this.#generateSupports(guides);
        const bases = this.#generateBases(supports);

        this.buildings = bases.map(b => new Building(b));
    }

    /** 
     * @param {Segment[]} graphSegments
     * @param {number} roadWidth
     * @param {number} roundness
     */
    #generateInitialEnvelopes(graphSegments = [], roadWidth, roundness) {
        const initials = [];

        for(let seg of graphSegments) {
            initials.push(
                new Envelope(
                    seg,
                    roadWidth + this.width + this.spacing * 2,
                    roundness
                )
            )
        }

        return initials;
    }

    /** @param {Envelope[]} initialEnvelopes */
    #generateFullGuides(initialEnvelopes){
        return Polygon.union(initialEnvelopes.map(e => e.polygon))
    }

    /** @param {Envelope[]} initialEnvelopes */
    #generatePartialGuides(initialEnvelopes) {
        const guides = this.#generateFullGuides(initialEnvelopes);

        let seg = null;
        for(let i = 0; i < guides.length; i++){
            seg = guides[i];
            if(seg.length < this.minLength) {
                guides.splice(i , 1);
                i--;
            }
        }

        return guides;
    }

    /** @param {Segment[]} guides */
    #generateSupports(guides){
        const supports = [];

        let length = undefined;
        let buildingCount = undefined;
        let buildingLength = undefined;

        let dir = undefined;
        
        let q1 = null;
        let q2 = null;

        for(let guide of guides){
            length = guide.length + this.spacing;
            buildingCount = Math.floor(length / (this.minLength + this.spacing));
            buildingLength = length / buildingCount - this.spacing;

            dir = guide.directionVector;

            q1 = guide.p1;
            q2 = add(q1, scale(dir, buildingLength))
            supports.push(new Segment(q1, q2));

            for (let i = 1; i < buildingCount; i++){
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength))
                supports.push(new Segment(q1, q2));
            }
        }

        return supports;
    }

    /** @param {Segment[]} supports */
    #generateBases(supports){
        const bases = [];

        for(let seg of supports){
            bases.push(new Envelope(seg, this.width).polygon)
        }

        const eps = 0.001;
        for(let i = 0; i < bases.length - 1; i++){
            for(let j = i + 1; j < bases.length; j++){
                if(
                    bases[i].intersectsPolygon(bases[j])
                    || bases[i].distanceToPolygon(bases[j]) < this.spacing - eps
                ) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
        this.buildings.forEach(b => b.draw(ctx, viewPoint))
    }
}

export default BuildingGeneratorAndDrawer
