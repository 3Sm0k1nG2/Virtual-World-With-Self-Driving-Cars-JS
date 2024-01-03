import Point from "./point.js";
import Segment from "./segment.js";
import { getRandomColor, getIntersection, average } from "../math/utils.js";

class Polygon {
    /** @param {Point[]} points */
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 1; i <= points.length; i++) {
            this.segments.push(
                new Segment(points[i - 1], points[i % points.length])
            );
        }
    }

    /** @param {Polygon[]} polys */
    static union(polys) {
        Polygon.multiBreak(polys);
        const keptSegments = [];
        for (let i = 0; i < polys.length; i++) {
            for (const seg of polys[i].segments) {
                let keep = true;
                for (let j = 0; j < polys.length; j++) {
                    if (i != j) {
                        if (polys[j].containsSegment(seg)) {
                            keep = false;
                            break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(seg);
                }
            }
        }
        return keptSegments;
    }

    /** @param {Polygon[]} polys */
    static multiBreak(polys) {
        for (let i = 0; i < polys.length - 1; i++) {
            for (let j = i + 1; j < polys.length; j++) {
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    /**
     * @param {Polygon} poly1 
     * @param {Polygon} poly2 
     */
    static break(poly1, poly2) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;

        let intr = null;
        let point = null;
        let aux = null;

        let iS1 = 0;
        let iS2 = 0;
        for (iS1 = 0; iS1 < segs1.length; iS1++) {
            for (iS2 = 0; iS2 < segs2.length; iS2++) {
                intr = getIntersection(
                    segs1[iS1].p1,
                    segs1[iS1].p2,
                    segs2[iS2].p1,
                    segs2[iS2].p2
                );

                if (intr && intr.offset != 1 && intr.offset != 0) {
                    point = new Point(intr.x, intr.y);

                    aux = segs1[iS1].p2;
                    segs1[iS1].p2 = point;
                    segs1.splice(iS1 + 1, 0, new Segment(point, aux));

                    aux = segs2[iS2].p2;
                    segs2[iS2].p2 = point;
                    segs2.splice(iS2 + 1, 0, new Segment(point, aux));
                }
            }
        }
    }

    /** @param {Point} point */
    distanceToPoint(point) {
        return Math.min(...this.segments.map(s => s.distanceToPoint(point)));
    }

    /** @param {Polygon} polygon */
    distanceToPolygon(polygon) {
        return Math.min(...this.points.map(p => polygon.distanceToPoint(p)));
    }

    /** @param {Polygon} polygon */
    intersectsPolygon(polygon) {
        for(let s1 of this.segments){
            for(let s2 of polygon.segments) {
                if(getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)){
                    return true;
                }
            }
        }

        return false;
    }

    /** @param {Segment} seg */
    containsSegment(seg) {
        const midpoint = average(seg.p1, seg.p2);
        return this.containsPoint(midpoint);
    }

    /** @param {Point} point */
    containsPoint(point) {
        const outerPoint = new Point(-1000, -1000);
        let intersectionCount = 0;
        for (const seg of this.segments) {
            const int = getIntersection(outerPoint, point, seg.p1, seg.p2);
            if (int) {
                intersectionCount++;
            }
        }
        return intersectionCount % 2 == 1;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    drawSegments(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx, { color: getRandomColor(), width: 5 });
        }
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {{ fill: string, stroke: string, lineWidth: number}} options
     */
    draw(
        ctx,
        { 
            stroke = "blue",
            width = 2,
            fill = "rgba(0,0,255,0.3)",
            alpha = 1,
            join = "miter"
        } = {}
    ) {
        ctx.beginPath();
        ctx.globalAlpha = alpha
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.lineJoin = join;
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}

export default Polygon;
