import Point from "../../primitives/point.js";
import Segment from "../../primitives/segment.js";
import Viewport from "../../viewport.js";
import Graph from "../../math/graph.js";
import GraphEditorEvents from "./graphEditorEvents.js";

class GraphEditor {
    #events

    /**
     * @param {Viewport} viewport 
     * @param {Graph} graph 
     * @param {GraphEditorEvents} events 
     * @param {number} alpha
     */
    constructor(
        viewport,
        graph,
        events,
        alpha = 0.3
    ){
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;
        this.alpha = alpha;

        this.ctx = this.canvas.getContext("2d");
        
        this.#events = {};
        for(let key in events){
            this.#events[key] = events[key].bind(null, this);
        }

        this.mouse = null;

        this.selected = null;
        this.hovered = null;
        this.dragging = false;

        this.enabled = false;
    }

    #addEventListeners = () => {
        this.canvas.addEventListener("mousedown", this.#events.onMouseDown)
        this.canvas.addEventListener("mousemove", this.#events.onMouseMove);
        this.canvas.addEventListener("mouseup", this.#events.onMouseUp)
    }

    #removeEventListeners = () => {
        this.canvas.removeEventListener("mousedown", this.#events.onMouseDown)
        this.canvas.removeEventListener("mousemove", this.#events.onMouseMove);
        this.canvas.removeEventListener("mouseup", this.#events.onMouseUp)
    }

    /** @param {Point} point */
    select(point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    /** @param {Point} point */
    removePoint(point) {
        this.graph.removePoint(point);
        
        this.hovered = null;
        if(this.selected?.equals(point)){
            this.selected = null;
        }
    }

    enable() {
        this.#addEventListeners();
        this.enabled = true;
    }

    disable() {
        this.#removeEventListeners();
        this.enabled = false;

        this.hovered = null;
        this.selected = null;
    }

    display() {
        if(!this.enabled){
            return;
        }

        this.graph.draw(this.ctx, { alpha: this.alpha });
        
        if(this.hovered){
            this.hovered.draw(this.ctx, { fill: true, alpha: this.alpha });
        }

        if(this.selected){
            const intent = this.hovered ?? this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3], alpha: this.alpha});
            this.selected.draw(this.ctx, {outline: true, alpha: this.alpha})
        }
    }

    dispose() {
        this.graph.dispose();
        
        this.selected = null;
        this.hovered = null;
    }
}

export default GraphEditor;
