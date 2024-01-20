import Border from "./border.js";
import Controls from "./controls.js";
import Point from "./point.js";
import Polygon from "./polygon.js";
import Sensor from "./sensor.js";
import { getPolygonIntersection } from "./utils.js";
import { CONTROL_TYPE_KEYS, CONTROL_TYPE_DUMMY, CONTROL_TYPE_AI } from "../../consts.js";
import NeuralNetwork from "../../ai/neural-network/network.js"
import NeuralNetworkManager from "../../ai/neural-network/neuralNetworkManager.js";
import EventListenerModule from "../../common/eventListenerModule.js";
import MyEvent from "../../common/myEvent.js"
import { carEventTypes } from "./carEvents.js";

class CarParams {
    constructor() {
        /** @type {EventListenerModule} */
        this.eventListenerModule;

        /** @type {number} */
        this.x 
        /** @type {number} */
        this.y 

        /** @type {number} */
        this.angle
        
        /** @type {number} */
        this.width 
        /** @type {number} */
        this.height
        
        /** @type {number} */
        this.maxSpeed  
        
        /** @type {CONTROL_TYPE_KEYS | CONTROL_TYPE_DUMMY | CONTROL_TYPE_AI} */
        this.controlType

        /** @type {string} */
        this.color;
    }
}

class Car {
    #eventListenerModule;

    /** @param {CarParams} params */
    constructor(params) {
        this.#eventListenerModule = params.eventListenerModule;

        this.x = params.x;
        this.y = params.y;

        this.angle = params.angle;

        this.width = params.width;
        this.height = params.height;

        this.controls = new Controls(params.controlType);
        this.controlType = params.controlType;

        this.color = params.color;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = params.maxSpeed;
        this.friction = 0.05;

        this.distanceTraveled = 0;

        this.useBrain = this.controlType === CONTROL_TYPE_AI;

        if(this.controlType !== CONTROL_TYPE_DUMMY) {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }
        this.polygon = new Polygon();

        this.isCrashed = false;

        this.braking = 0.2;
        this.drag = 0;

        this.img = new Image();
        this.img.src = "../../car.svg"

        this.mask = document.createElement('canvas');
        this.mask.width = this.width;
        this.mask.height = this.height;

        const maskCtx = this.mask.getContext("2d");
        this.img.onload = () => {
            maskCtx.fillStyle = this.color;
            maskCtx.rect(0, 0, this.width, this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img, 0, 0, this.width, this.height);
        }
    }

    /** 
     * @param {keyof carEventTypes} eventName
     * @param {(event?: MyEvent<Car>) => void} callback
     */
    addEventListener(eventName, callback) {
        this.#eventListenerModule.addEventListener(
            eventName,
            callback.bind(null, new MyEvent(this))
        );
    }

    /** @param {keyof carEventTypes} eventName */
    removeEventListeners(eventName) {
        this.#eventListenerModule.removeEventListeners(eventName);
    }

    /** @param {keyof carEventTypes} eventName */
    dispatchEvent(eventName) {
        this.#eventListenerModule.dispatchEvent(eventName);
    }

    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        this.speed = Math.min(this.maxSpeed, Math.max(-this.maxSpeed / 2, this.speed));

        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;

        this.distanceTraveled += this.speed;
    }

    #updatePolygon() {
        const points = this.polygon.points;
        points.length = 0;

        const radius = Math.hypot(this.width, this.height) / 2;

        const angle = Math.atan2(this.width, this.height);

        points.push(
            new Point(
                this.x - Math.sin(this.angle - angle) * radius,
                this.y - Math.cos(this.angle - angle) * radius
            ),
            new Point(
                this.x - Math.sin(this.angle + angle) * radius,
                this.y - Math.cos(this.angle + angle) * radius
            ),
            new Point(
                this.x - Math.sin(Math.PI + this.angle - angle) * radius,
                this.y - Math.cos(Math.PI + this.angle - angle) * radius
            ),
            new Point(
                this.x - Math.sin(Math.PI + this.angle + angle) * radius,
                this.y - Math.cos(Math.PI + this.angle + angle) * radius
            ),
        );
    }

    /** @param {Border[]} borders */
    #assessDamage(borders) {
        for(let border of borders) {
            if(
                getPolygonIntersection(
                    this.polygon,
                    new Polygon([border.p1, border.p2])
                )
            ) {
                this.isCrashed = true;
                this.dispatchEvent("oncrash");

                return;
            }
        }

        this.isCrashed = false;
    }

    /** 
     * @param {Border[]} borders
     * @param {NeuralNetworkManager} neuralNetworkManager
     */
    #updateSensorsEvenIfCrashed(borders, neuralNetworkManager) {
        if(this.sensor){
            this.sensor.update(borders);
            
            const offsets = this.sensor.readings
                .map(s => s === null ? 0 : 1-s.offset);

            const outputs = neuralNetworkManager.feedForwardNetwork(this.brain, offsets);

            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
        
        if(!this.isCrashed){
            this.#move();
            this.#updatePolygon();
            this.#assessDamage(borders);
        }
    }

    /** 
     * @param {Border[]} borders
     * @param {NeuralNetworkManager} neuralNetworkManager
     */
    #updateSensorsIfNotCrashed(borders, neuralNetworkManager) {
        if(this.isCrashed) {
            return;
        }

        if(this.sensor){
            this.sensor.update(borders);
            
            const offsets = this.sensor.readings
                .map(s => s === null ? 0 : 1-s.offset);

            const outputs = neuralNetworkManager.feedForwardNetwork(this.brain, offsets);

            if(this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }

        this.#move();
        this.#updatePolygon();
        this.#assessDamage(borders);
    }

    /** 
     * @param {Border[]} borders
     * @param {NeuralNetworkManager} neuralNetworkManager
     */
    update(borders, neuralNetworkManager) {
        this.#updateSensorsIfNotCrashed(borders, neuralNetworkManager);
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {string} color
     * @param {boolean} drawSensor
     */
    draw(ctx, drawSensor) {
        if(drawSensor){
            this.sensor?.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);
        if(!this.isCrashed) {
            ctx.drawImage(
                this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height
            )
            ctx.globalCompositeOperation = "multiply";
        }
        ctx.drawImage(
            this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        )

        ctx.restore();

    }
}

export default Car;
