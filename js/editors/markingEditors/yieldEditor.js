import Point from "../../primitives/point.js";
import Viewport from "../../viewport.js";
import World from "../../world.js";
import MarkingEditor from "./markingEditor.js"
import Yield from "../../markings/yield.js"

class YieldEditor extends MarkingEditor {
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
        return new Yield(
            center,
            directionVector,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
        )
    }
}

export default YieldEditor;
