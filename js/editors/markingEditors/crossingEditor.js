import Crossing from "../../markings/crossing.js";
import Viewport from "../../viewport.js";
import World from "../../world.js";
import MarkingEditor from "./markingEditor.js";

class CrossingEditor extends MarkingEditor {
    /**
     * @param {Viewport} viewport 
     * @param {World} world  
     */
    constructor(
        viewport,
        world,
    ) {
        super(viewport, world, world.graph.segments);
    }

    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     */
    createMarking(center, directionVector) {
        return new Crossing(
            center,
            directionVector,
            this.world.roadGeneratorAndDrawer.roadWidth,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
        )
    }
}

export default CrossingEditor;
