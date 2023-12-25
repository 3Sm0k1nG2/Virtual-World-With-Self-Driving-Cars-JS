import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";

class Graph {
    /**
     * @param {Point[]} points 
     * @param {Segment[]} segments 
     */
    constructor(points = [], segments = []){
        this.points = points;
        this.segments = segments;
    }

    /** @param {Point} point */
    addPoint(point){
        this.points.push(point);
        this.segments.splice()
    }

    /** @param {Point} point */
    containsPoint(point){
        return this.points.find(p => p.equals(point))
            ? true
            : false;
    }

    /** @param {Point} point */
    tryAddPoint(point){
        if(this.containsPoint(point)){
            return false;
        }
        
        this.addPoint(point) ;

        return true;
    }

    removePoint(point) {
        this.getSegmentsWithPoint(point).forEach(s => this.removeSegment(s));
        this.points.splice(this.points.indexOf(point), 1);
    }

    /** @param {Segment} seg */
    addSegment(seg){
        this.segments.push(seg);
    }

    /** @param {Segment} seg */
    containsSegment(seg){
        return this.segments.find(s => s.equals(seg))
            ? true
            : false;
    }

    /** @param {Segment} seg */
    tryAddSegment(seg){
        if(this.containsSegment(seg)){
            return false;
        }

        if(seg.p1.equals(seg.p2)){
            return false;
        }
        
        this.addSegment(seg) ;

        return true;
    }

    /** @param {Segment} seg */
    removeSegment(seg){
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    /** @param {Point} point*/
    getSegmentsWithPoint(point){
        return this.segments.filter(s => s.includes(point))
    }

    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx){
        for(const seg of this.segments){
           seg.draw(ctx);
        }

        for(const point of this.points){
            point.draw(ctx);
        }
    }
}

export default Graph;
