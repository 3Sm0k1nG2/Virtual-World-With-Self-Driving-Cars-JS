import Point from "./primitives/point.js";
import { MOUSE_MIDDLE_BUTTON } from "./consts.js"
import { add, scale, subtract } from "./math/utils.js";

class Viewport {
    /** @param {HTMLCanvasElement} canvas */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);
        this.offset = scale(this.center, -1);

        this.pan = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false,
        }

        this.#addEventListeners();
    }

    /** @param {MouseEvent} e */
    #addEventListeners(e) {
        this.canvas.addEventListener("mousewheel", this.#handleMouseWheel.bind(this));
        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", this.#handleMouseUp.bind(this));
    }

    /** @param {WheelEvent} e */
    #handleMouseDown(e) {
        if (e.button === MOUSE_MIDDLE_BUTTON) {
            this.pan.active = true;
            this.pan.start = this.getMouse(e);
        }
    }

    /** @param {WheelEvent} e */
    #handleMouseMove(e) {
        if (this.pan.active) {
            this.pan.end = this.getMouse(e);
            this.pan.offset = subtract(this.pan.end, this.pan.start);
        }
    }

    /** @param {WheelEvent} e */
    #handleMouseUp(e) {
        if (this.pan.active) {
            this.offset = add(this.offset, this.pan.offset);
            this.#resetPan();
        }
    }

    #resetPan() {
        this.pan.start.x = 0;
        this.pan.start.y = 0;

        this.pan.end.x = 0;
        this.pan.end.y = 0;

        this.pan.offset.x = 0;
        this.pan.offset.y = 0;

        this.pan.active = false;
    }

    /** @param {WheelEvent} e */
    #handleMouseWheel(e) {
        const dir = Math.sign(e.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }

    /** @param {MouseEvent} e */
    getMouse(e, subtractPanOffset = false) {
        const p = new Point(
            (e.offsetX - this.center.x) * this.zoom - this.offset.x,
            (e.offsetY - this.center.y) * this.zoom - this.offset.y
        );

        return subtractPanOffset ? subtract(p, this.pan.offset) : p;
    }

    getOffset() {
        return add(this.offset, this.pan.offset);
    }

    reset() {
        this.ctx.restore();

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
    
        this.ctx.translate(this.center.x, this.center.y);
    
        this.ctx.scale(1 / this.zoom, 1 / this.zoom);
        
        const offset = this.getOffset();
        this.ctx.translate(offset.x, offset.y)
    }
}

export default Viewport;
