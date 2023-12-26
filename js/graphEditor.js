import Point from "./primitives/point.js";
import Segment from "./primitives/segment.js";
import Viewport from "./viewport.js";
import Graph from "./math/graph.js";
import { getNearestPoint } from "./math/utils.js";
import { MOUSE_LEFT_BUTTON, MOUSE_MIDDLE_BUTTON, MOUSE_RIGHT_BUTTON } from "./consts.js";

class GraphEditor {
    /**
     * @param {Viewport} viewport 
     * @param {Graph} graph 
     */
    constructor(viewport, graph){
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.graph = graph;

        this.ctx = this.canvas.getContext("2d");
        
        this.mouse = null;

        this.selected = null;
        this.hovered = null;
        this.dragging = false;

        this.#addEventListeners()
    }

    #addEventListeners = () => {
        this.canvas.addEventListener("contextmenu", (e) => { e.preventDefault(); })

        this.canvas.addEventListener("mousedown", this.#handleMouseDown.bind(this))
        this.canvas.addEventListener("mousemove", this.#handleMouseMove.bind(this));
        this.canvas.addEventListener("mouseup", (e) => { this.dragging = false; })
    }

    /** @param {MouseEvent} e */
    #handleMouseDown(e){
        switch(e.button) {
            case MOUSE_RIGHT_BUTTON: 
                if(this.selected){
                    this.selected = null;
                    return;
                }

                if(this.hovered){
                    this.#removePoint(this.hovered);
                    return;
                }
                
                break;

            case MOUSE_MIDDLE_BUTTON: 

                break;

            case MOUSE_LEFT_BUTTON: 
                if(this.hovered){
                    this.#select(this.hovered);
                    this.dragging = true;
                    return;
                }

                this.graph.addPoint(this.mouse);
                this.#select(this.mouse);
                this.hovered = this.mouse;
            
                break;
        }
    }

    /** @param {MouseEvent} e */
    #handleMouseMove(e){
        this.mouse = this.viewport.getMouse(e, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 0.1 * this.viewport.zoom);

        if(this.dragging){
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    /** @param {Point} point */
    #select(point){
        if(this.selected){
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    /** @param {Point} point */
    #removePoint(point) {
        this.graph.removePoint(point);
        
        this.hovered = null;
        if(this.selected?.equals(point)){
            this.selected = null;
        }
    }


    display() {
        this.graph.draw(this.ctx);
        
        if(this.hovered){
            this.hovered.draw(this.ctx, { fill: true });
        }

        if(this.selected){
            const intent = this.hovered ?? this.mouse;
            new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3]});
            this.selected.draw(this.ctx, {outline: true})
        }
    }

    dispose() {
        this.graph.dispose();
        
        this.selected = null;
        this.hovered = null;
    }
}

export default GraphEditor;
