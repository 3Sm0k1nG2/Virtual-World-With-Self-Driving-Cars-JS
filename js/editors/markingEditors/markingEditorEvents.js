import { MOUSE_LEFT_BUTTON, MOUSE_RIGHT_BUTTON } from "../../consts.js";
import { getNearestSegment } from "../../math/utils.js";
import MarkingEditor from "./markingEditor.js";

class MarkingEditorEvents { 
    /** 
     * @param {MarkingEditor} markingEditor
     * @param {MouseEvent} e
    */
   onMouseDown = (markingEditor, e) => {
            switch(e.button) {
                case MOUSE_RIGHT_BUTTON: 
                    const markingIndex = markingEditor.world.markings.findIndex(m => m.polygon.containsPoint(markingEditor.mouse));
                    if(markingIndex === -1) {
                        return;
                    }

                    markingEditor.world.markings.splice(markingIndex, 1);

                    break;
                case MOUSE_LEFT_BUTTON: 
                    if(!markingEditor.intent) {
                        return;
                    }

                    markingEditor.world.markings.push(markingEditor.intent)
                    markingEditor.intent = null;

                    break;
            }
        }
    
        /**
         * @param {number} offset 
         */
        #isProjOffsetOutOfBound(offset){
            return offset < 0 || offset > 1;
        }

        /** 
         * @param {MarkingEditor} markingEditor
         * @param {MouseEvent} e
         */
        onMouseMove = (markingEditor, e) => {
            markingEditor.mouse = markingEditor.viewport.getMouse(e, true);

            const segment = getNearestSegment(
                markingEditor.mouse,
                markingEditor.targetSegments,
                0.1 * markingEditor.viewport.zoom
            );

            if(!segment){
                markingEditor.intent = null;
                return;
            }

            const proj = segment.projectPoint(markingEditor.mouse);

            if(this.#isProjOffsetOutOfBound(proj.offset)){
                markingEditor.intent = null;
                return;
            }

            markingEditor.intent = markingEditor.createMarking(
                proj.point,
                segment.directionVector
            )
        }
}

export default MarkingEditorEvents;
