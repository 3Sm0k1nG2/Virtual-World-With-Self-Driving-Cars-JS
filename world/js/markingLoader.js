import { MARKING_CROSSING, MARKING_LIGHT, MARKING_PARKING, MARKING_START, MARKING_STOP, MARKING_TARGET, MARKING_YIELD } from "./consts.js";
import Marking from "./markings/marking.js";
import Stop from "./markings/stop.js";
import Yield from "./markings/yield.js";
import Crossing from "./markings/crossing.js";
import Parking from "./markings/parking.js";
import Light from "./markings/light.js";
import Start from "./markings/start.js";
import Target from "./markings/target.js";
import Point from "./primitives/point.js";

class MarkingLoader {
    constructor() {

    }

    /** @param {Marking} rawData */
    load(rawData) {
        const markings = {
            [MARKING_STOP]: Stop,
            [MARKING_YIELD]: Yield,
            [MARKING_CROSSING]: Crossing,
            [MARKING_PARKING]: Parking,
            [MARKING_LIGHT]: Light,
            [MARKING_START]: Start,
            [MARKING_TARGET]: Target,
        }


        return new markings[rawData.type](
            new Point(rawData.center.x, rawData.center.y),
            new Point(rawData.directionVector.x, rawData.directionVector.y),
            rawData.width,
            rawData.height
        );
    }
}

export default MarkingLoader;
