import Point from "../../primitives/point.js";
import Viewport from "../../viewport.js";
import World from "../../world.js";
import MarkingEditor from "./markingEditor.js"
import Parking from "../../markings/parking.js"

class ParkingEditor extends MarkingEditor {
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
        return new Parking(
            center,
            directionVector,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
            this.world.roadGeneratorAndDrawer.roadWidth / 2,
        )
    }
}

export default ParkingEditor;
