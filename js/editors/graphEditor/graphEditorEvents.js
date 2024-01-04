import { MOUSE_LEFT_BUTTON, MOUSE_MIDDLE_BUTTON, MOUSE_RIGHT_BUTTON } from "../../consts.js";
import { getNearestPoint } from "../../math/utils.js";
import GraphEditor from "./graphEditor.js";

class GraphEditorEvents { 
        /** 
         * @param {GraphEditor} graphEditor
         * @param {MouseEvent} e
         */
        onMouseDown = (graphEditor, e) => {
            switch(e.button) {
                case MOUSE_RIGHT_BUTTON: 
                    if(graphEditor.selected){
                        graphEditor.selected = null;
                        return;
                    }
    
                    if(graphEditor.hovered){
                        graphEditor.removePoint(graphEditor.hovered);
                        return;
                    }
                    
                    break;
    
                case MOUSE_MIDDLE_BUTTON: 
    
                    break;
    
                case MOUSE_LEFT_BUTTON: 
                    if(graphEditor.hovered){
                        graphEditor.select(graphEditor.hovered);
                        graphEditor.dragging = true;
                        return;
                    }
    
                    graphEditor.graph.addPoint(graphEditor.mouse);
                    graphEditor.select(graphEditor.mouse);
                    graphEditor.hovered = graphEditor.mouse;
                
                    break;
            }
        }
    
        /** 
         * @param {GraphEditor} graphEditor
         * @param {MouseEvent} e
         */
        onMouseMove = (graphEditor, e) => {
            graphEditor.mouse = graphEditor.viewport.getMouse(e, true);
            graphEditor.hovered = getNearestPoint(graphEditor.mouse, graphEditor.graph.points, 0.1 * graphEditor.viewport.zoom);
    
            if(graphEditor.dragging){
                graphEditor.selected.x = graphEditor.mouse.x;
                graphEditor.selected.y = graphEditor.mouse.y;
            }
        }
    
        /** 
         * @param {GraphEditor} graphEditor
         * @param {MouseEvent} e
         */
        onMouseUp = (graphEditor, e) => {
            graphEditor.dragging = false;
        }
}

export default GraphEditorEvents;
