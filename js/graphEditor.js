import Point from "./primitives/point.js";
import Segment from "./primitives/segment.js";
import Graph from "./math/graph.js";
import { getNearestPoint } from "./math/utils.js";

class GraphEditor {
    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Graph} graph 
     */
    constructor(canvas, graph){
        this.canvas = canvas;
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
        if(e.button == 2){ // right click
            if(this.selected){
                this.selected = null;
                return;
            }

            if(this.hovered){
                this.#removePoint(this.hovered);
                return;
            }

            return;
        }

        if(e.button == 0) { // left click
            if(this.hovered){
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }

            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;

            return;
        }
    }

    /** @param {MouseEvent} e */
    #handleMouseMove(e){
        this.mouse = new Point(e.offsetX, e.offsetY);

        this.hovered = getNearestPoint(this.mouse, this.graph.points, 0.1);

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
}

export default GraphEditor;
