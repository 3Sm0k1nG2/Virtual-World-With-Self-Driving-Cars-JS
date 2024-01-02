import Graph from "../math/graph.js";
import { distance, lerp } from "../math/utils.js";
import Envelope from "../primitives/envelope.js";
import Point from "../primitives/point.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";

class TreeGeneratorAndDrawer {
    constructor(treeSize = 160) {
        this.size = treeSize;

        /** @type {Point[]} */
        this.trees = [];
    }

    /** 
     * @param {Graph} graph
     * @param {Segment[]} roadBorders
     * @param {Polygon[]} buildings
     * @param {Envelope[]} roadEnvelopes
     * @param {number} trees
     */
    generate(
        graph,
        roadBorders,
        buildings,
        roadEnvelopes, 
    ) {
        const points = [
            ...roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...buildings.map(b => b.points).flat()
        ]

        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));

        const illegalPolygons = [
            ...buildings,
            ...roadEnvelopes.map(r => r.polygon)
        ]

        this.trees.length = 0;

        let tryCount = 0;
        const maxTryCount = 100;

        let tree = null;
        let keep = true;
        let closeToSomething = true;
        while(tryCount < maxTryCount) {
            tree = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random()),
            );
            
            keep = true;
            for(let polygon of illegalPolygons){
                if(polygon.containsPoint(tree) || polygon.distanceToPoint(tree) < this.size / 2){
                    keep = false;
                    break;
                }
            }

            if(!keep) {
                continue;
            }

            for(let spawnedTree of this.trees){
                if(distance(spawnedTree, tree) < this.size) {
                    keep = false;
                    break;
                }
            }

            if(!keep) {
                tryCount++;
                continue;
            }

            closeToSomething = false;
            for(let polygon of illegalPolygons) {
                if(polygon.distanceToPoint(tree) < this.size * 2) {
                    closeToSomething = true;
                    break;
                }
            }

            if(!closeToSomething){
                continue;
            }

            this.trees.push(tree);
            tryCount = 0;
        }
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.trees.forEach(t => t.draw(ctx, {
            size: this.size,
            color: "rgba(0,0,0,0.5)"
        }));
    }
}

export default TreeGeneratorAndDrawer;
