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
 * @param {number} scaler
 */
export function scale(p, scaler){
    return new Point(p.x * scaler, p.y * scaler);
}
