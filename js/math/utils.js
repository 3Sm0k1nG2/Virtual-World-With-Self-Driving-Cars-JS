import Point from "../primitives/point.js";

/**
 * 
 * @param {Point} loc 
 * @param {Point[]} points 
 * @param {number} threshold 
 */
export function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER){
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    for(const point of points){
        const dist = distance(point, loc);

        if(dist < minDist && (dist/100) < threshold){
            minDist = dist;
            nearest = point;
        }
    }

    return nearest;
}

/**
 * @param {Point} p1 
 * @param {Point} p2 
 */
function distance(p1, p2){
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
 * @param {number} scaler
 */
export function scale(p, scaler){
    return new Point(p.x * scaler, p.y * scaler);
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

    if(bottom !== 0) {
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
function lerp(a, b, top){
    return a + (b - a) * top;
}

export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%";
}
