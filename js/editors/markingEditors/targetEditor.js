import Point from "../../primitives/point.js";
import Viewport from "../../viewport.js";
import World from "../../world.js";
import MarkingEditor from "./markingEditor.js"
import Target from "../../markings/target.js"

class TargetEditor extends MarkingEditor {
    /**
     * @param {Viewport} viewport 
     * @param {World} world  
     */
    constructor(
        viewport,
        world,
    ) {
        super(viewport, world, world.laneGuidesGeneratorAndDrawer.laneGuides);
    }

    /**
     * @param {Point} center 
     * @param {Point} directionVector 
     */
    createMarking(center, directionVector) {
        return new Target(
            center,
            directionVector,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
        )
    }
}

export default TargetEditor;
