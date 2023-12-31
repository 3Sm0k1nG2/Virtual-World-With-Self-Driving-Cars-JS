import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";

/**
 * 
 * @param {Point} loc 
 * @param {Point[]} points 
 * @param {number} threshold 
 */
export function getNearestPoint(
    loc,
    points,
    threshold = Number.MAX_SAFE_INTEGER
){
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    let dist = undefined;
    for(let point of points){
        dist = distance(point, loc);

        if(dist < minDist && (dist/100) < threshold){
            minDist = dist;
            nearest = point;
        }
    }

    return nearest;
}

/**
 * 
 * @param {Point} loc 
 * @param {Segment[]} segments 
 * @param {number} threshold 
 */
export function getNearestSegment(
    loc,
    segments,
    threshold = Number.MAX_SAFE_INTEGER
){
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    let dist = undefined;
    for(let segment of segments){
        dist = segment.distanceToPoint(loc);

        if(dist < minDist && (dist/100) < threshold){
            minDist = dist;
            nearest = segment;
        }
    }

    return nearest;
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 */
export function distance(p1, p2){
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 */
export function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 */
export function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

/**
 * @param {Point} p1
 * @param {Point} p2
 */
export function average(p1, p2) {
    return new Point((p1.x + p2.x)/2, (p1.y + p2.y)/2);
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 */
export function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

/**
 * @param {Point} p1 
 * @param {number} scaler
 */
export function scale(p, scaler){
    return new Point(p.x * scaler, p.y * scaler);
}

/** @param {Point} p */
export function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

/** @param {Point} p */
export function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

/** @param {Point} p */
export function perpendicular(p){
    return new Point(-p.y, p.x);
}

/**
 * @param {Point} loc 
 * @param {number} angle 
 * @param {number} offset 
 * @returns 
 */
export function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    );
}

/** @param {Point} point */
export function angle(point) {
    return Math.atan2(point.y, point.x);
}

/**
 * @param {Point} a 
 * @param {Point} b 
 * @param {Point} c 
 * @param {Point} d 
 */
export function getIntersection(a, b, c, d) {
    const tTop =  (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
    const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x-c.x)*(b.y-a.y);

    const eps = 0.001;
    if(Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(
            t >= 0
            && t <= 1
            && u >= 0
            && u <= 1
        ) {
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t
            }
        }
    }

    return null;
}

/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @param {number} top 
 */
export function lerp(a, b, top){
    return a + (b - a) * top;
}

/**
 * @param {Point} pA 
 * @param {Point} pB 
 * @param {number} top 
 */
export function lerp2D(pA, pB, top) {
    return new Point(lerp(pA.x, pB.x, top), lerp(pA.y, pB.y, top));
}

export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%";
}

export function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
 }
