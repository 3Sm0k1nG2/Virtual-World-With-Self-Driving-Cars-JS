import Graph from "../math/graph.js";
import { distance, lerp } from "../math/utils.js";
import Envelope from "../primitives/envelope.js";
import Point from "../primitives/point.js";
import Polygon from "../primitives/polygon.js";
import Segment from "../primitives/segment.js";
import Tree from "../items/tree.js"
import Building from "../items/building.js";

class TreeGeneratorAndDrawer {
    constructor(treeSize = 160) {
        this.treeSize = treeSize;

        /** @type {Tree[]} */
        this.trees = [];
    }

    /** 
     * @param {Segment[]} roadBorders
     * @param {Building[]} buildings
     * @param {Envelope[]} roadEnvelopes
     * @param {number} trees
     */
    generate(
        roadBorders,
        buildings,
        roadEnvelopes, 
    ) {
        this.trees.length = 0;

        const points = [
            ...roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...buildings.map(b => b.base.points).flat()
        ]
        
        if(!points?.length){
            return;
        }
        
        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));

        const illegalPolygons = [
            ...buildings.map(b => b.base),
            ...roadEnvelopes.map(r => r.polygon)
        ]

        let tryCount = 0;
        const maxTryCount = 100;

        let treePoint = null;
        let keep = true;
        let closeToSomething = true;
        while(tryCount < maxTryCount) {
            treePoint = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random()),
            );
            
            keep = true;
            for(let polygon of illegalPolygons){
                if(polygon.containsPoint(treePoint) || polygon.distanceToPoint(treePoint) < this.treeSize / 2){
                    keep = false;
                    break;
                }
            }

            if(!keep) {
                tryCount++;
                continue;
            }

            for(let spawnedTree of this.trees){
                if(distance(spawnedTree.center, treePoint) < this.treeSize) {
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
                if(polygon.distanceToPoint(treePoint) < this.treeSize * 2) {
                    closeToSomething = true;
                    break;
                }
            }

            if(!closeToSomething){
                continue;
            }

            this.trees.push(new Tree(treePoint, this.treeSize));
            tryCount = 0;
        }
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
        this.trees.forEach(t => t.draw(ctx, viewPoint));
    }
}

export default TreeGeneratorAndDrawer;
