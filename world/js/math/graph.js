import DrawOptions from "../primitives/drawOptions.js";
import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";

class Graph {
    /**
     * @param {Point[]} points 
     * @param {Segment[]} segments 
     */
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    /** 
     * @param {{
    *   points: {
    *       x: number, 
    *       y: number
    *   }[],
    *   segments: {
    *       p1: {
    *           x: number,
    *           y: number
    *       },
    *       p2: {
    *           x:number,
    *           y: number
    *       }
    *   }[]
     *  }} graphData 
     */
    static load(graphData) {
        const points = graphData.points
            .map(p => new Point(p.x, p.y));
        const segments = graphData.segments
            .map(s => new Segment(
                points.find(p => p.equals(s.p1)),
                points.find(p => p.equals(s.p2))
            ));

        return new Graph(points, segments);
    }

    /** @param {Point} point */
    addPoint(point) {
        this.points.push(point);
        this.segments.splice()
    }

    /** @param {Point} point */
    containsPoint(point) {
        return this.points.find(p => p.equals(point))
            ? true
            : false;
    }

    /** @param {Point} point */
    tryAddPoint(point) {
        if (this.containsPoint(point)) {
            return false;
        }

        this.addPoint(point);

        return true;
    }

    /** @param {Point} point */
    removePoint(point) {
        this.getSegmentsWithPoint(point).forEach(s => this.removeSegment(s));
        this.points.splice(this.points.indexOf(point), 1);
    }

    /** @param {Segment} seg */
    addSegment(seg) {
        this.segments.push(seg);
    }

    /** @param {Segment} seg */
    containsSegment(seg) {
        return this.segments.find(s => s.equals(seg))
            ? true
            : false;
    }

    /** @param {Segment} seg */
    tryAddSegment(seg) {
        if (this.containsSegment(seg)) {
            return false;
        }

        if (seg.p1.equals(seg.p2)) {
            return false;
        }

        this.addSegment(seg);

        return true;
    }

    /** @param {Segment} seg */
    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    /** @param {Point} point*/
    getSegmentsWithPoint(point) {
        return this.segments.filter(s => s.includes(point))
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    hash() {
        return JSON.stringify(this);
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {DrawOptions} drawOptions
     */
    draw(ctx, drawOptions) {
        for (const seg of this.segments) {
            seg.draw(ctx, drawOptions);
        }

        for (const point of this.points) {
            point.draw(ctx, drawOptions);
        }
    }
}

export default Graph;
