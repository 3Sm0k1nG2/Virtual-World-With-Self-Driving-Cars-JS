import Border from "./border.js"
import Ray from "./ray.js"
import Intersection from "./intersection.js";
import Car from "./car.js";
import { getIntersection, lerp } from "./utils.js";
import Point from "./point.js";

class Sensor {
    /** @param {Car} car */
    constructor(car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI/2;

        /** @type {Ray[]} */
        this.rays = [];
        /** @type {Intersection[]} */
        this.readings = [];
    }

    #castSingleRay() {
        const rayAngle = lerp(
            this.raySpread / 2,
            -this.raySpread / 2,
            0.5
        ) + this.car.angle;

        const start = {
            x: this.car.x,
            y: this.car.y,
        }
        const end = {
            x: this.car.x - Math.sin(rayAngle) * this.rayLength,
            y: this.car.y - Math.cos(rayAngle) * this.rayLength
        }

        this.rays.push({ start, end });
    }

    #castMultipleRays() {
        let rayAngle = undefined;
        let start = {
            x: this.car.x,
            y: this.car.y,
        }
        /** @type {{x: number, y: number} | null} */
        let end = null;

        for (let i = 0; i < this.rayCount; i++) {
            rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                i / (this.rayCount - 1)
            ) + this.car.angle;

            end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }
           
            this.rays.push({ start, end });
        }
    }

    #castRays() {
        this.rays.length = 0;

        if(this.rayCount === 1) {
            this.#castSingleRay();
        } else {
            this.#castMultipleRays();
        }
    }

    /**
     * @param {Ray} ray 
     * @param {Border[]} roadBorders 
     */
    #getClosestReading(ray, roadBorders) {
        const touches = [];

        let touch;
        for(let borders of roadBorders){
            touch = getIntersection(
                ray.start,
                ray.end,
                borders.p1,
                borders.p2
            );

            if(!touch){
                continue;
            }

            touches.push(touch);
        }

        return touches.length ? touches.reduce((prev, curr) => prev.offset < curr.offset ? prev : curr) : null;
    }

    /** @param {Border[]} borders */
    update(borders) {
        this.#castRays();

        this.readings.length = 0;
        for(let ray of this.rays){
            this.readings.push(
                this.#getClosestReading(
                    ray,
                    borders
                )
            );
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Point} start 
     * @param {Point} end 
     * @param {string} strokeStyle
     */
    #drawRay(ctx, start, end, strokeStyle) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeStyle;
        ctx.moveTo(
            start.x,
            start.y,
        );
        ctx.lineTo(
            end.x,
            end.y,
        );
        ctx.stroke();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Point} start 
     * @param {Point} end 
     */
    #drawUnobstructedRay(ctx, start, end) {
        this.#drawRay(ctx, start, end, 'yellow')
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Point} start 
     * @param {Point} end 
     */
    #drawObstructedRay(ctx, start, end) {
        this.#drawRay(ctx, start, end, 'black')
    }

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        let ray = null;
        let reading = null;
        let end = null;

        for(let i in this.rays){
            ray = this.rays[i];
            reading = this.readings[i];

            end = ray.end;
            if(reading){
                end = reading;
            }

            this.#drawUnobstructedRay(ctx, ray.start, end)
            
            this.#drawObstructedRay(ctx, end, ray.end);
        }
    }
}

export default Sensor;
