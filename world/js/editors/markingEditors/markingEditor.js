import Point from "../../primitives/point.js";
import Segment from "../../primitives/segment.js";
import Viewport from "../../viewport.js";
import World from "../../world.js";
import MarkingEditorEvents from "./markingEditorEvents.js";

class MarkingEditor {
    /** @type {MarkingEditorEvents} */
    #events
    
    /**
     * @param {Viewport} viewport 
     * @param {World} world  
     * @param {Segment[]} targetSegments  
     */
    constructor(
        viewport,
        world,
        targetSegments
    ) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        const events = new MarkingEditorEvents();
        this.#events = {};
        for(let key in events){
            this.#events[key] = events[key].bind(null, this);
        }

        this.enabled = false;

        /** @type {Point} */
        this.mouse = null;
        /** @type {Segment} */
        this.intent = null;

        this.targetSegments = targetSegments
    }

    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     */
    createMarking(center, directionVector) {
        throw new EvalError("Not implemented");
    }

    #addEventListeners() {
        this.canvas.addEventListener("mousedown", this.#events.onMouseDown);
        this.canvas.addEventListener("mousemove", this.#events.onMouseMove);
    }

    #removeEventListeners() {
        this.canvas.removeEventListener("mousedown", this.#events.onMouseDown);
        this.canvas.removeEventListener("mousemove", this.#events.onMouseMove);
    }

    enable() {
        this.#addEventListeners();

        this.enabled = true;
    }

    disable() {
        this.#removeEventListeners();

        this.enabled = false;
    }

    display() {
        if(
            !this.enabled
            || !this.intent
        ){
            return;
        }

        this.intent.draw(this.ctx);
    }
}

export default MarkingEditor;
