import Graph from "./math/graph.js";
import RoadGeneratorAndDrawer from "./world/roadGeneratorAndDrawer.js";
import LaneGuidesGeneratorAndDrawer from "./world/laneGuidesGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./world/treeGeneratorAndDrawer.js";
import Light from "./markings/light.js";
import { getNearestPoint } from "./math/utils.js";
import Point from "./primitives/point.js";

class World {
    /**
     * @param {Graph} graph 
     * @param {RoadGeneratorAndDrawer} roadGeneratorAndDrawer 
     * @param {LaneGuidesGeneratorAndDrawer} laneGuidesGeneratorAndDrawer 
     * @param {BuildingGeneratorAndDrawer} buildingGeneratorAndDrawer 
     * @param {TreeGeneratorAndDrawer} treeGeneratorAndDrawer 
     */
    constructor(
        graph,
        roadGeneratorAndDrawer,
        laneGuidesGeneratorAndDrawer,
        buildingGeneratorAndDrawer,
        treeGeneratorAndDrawer
    ) {
        this.graph = graph;
        this.roadGeneratorAndDrawer = roadGeneratorAndDrawer;
        this.laneGuidesGeneratorAndDrawer = laneGuidesGeneratorAndDrawer;
        this.buildingGeneratorAndDrawer = buildingGeneratorAndDrawer;
        this.treeGeneratorAndDrawer = treeGeneratorAndDrawer;

        this.debug = false;

        this.markings = [];

        this.frameCount = 0;

        this.generate();
    }

    generate() {
        this.roadGeneratorAndDrawer.generate(this.graph);
        this.laneGuidesGeneratorAndDrawer.generate(
            this.graph.segments,
            this.roadGeneratorAndDrawer.roadWidth,
            this.roadGeneratorAndDrawer.roadRoundness
        );
        this.buildingGeneratorAndDrawer.generate(
            this.graph,
            this.roadGeneratorAndDrawer.roadWidth,
            this.roadGeneratorAndDrawer.roadRoundness
        );
        this.treeGeneratorAndDrawer.generate(
            this.roadGeneratorAndDrawer.roadBorders,
            this.buildingGeneratorAndDrawer.buildings,
            this.roadGeneratorAndDrawer.roadEnvelopes
        );
    }

    #getIntersections() {
        const subset = [];
        for (const point of this.graph.points) {
            let degree = 0;
            for (const seg of this.graph.segments) {
                if (seg.includes(point)) {
                    degree++;
                }
            }

            if (degree > 2) {
                subset.push(point);
            }
        }
        return subset;
    }

    #updateLights() {
        const lights = this.markings.filter((m) => m instanceof Light);
        const intersections = this.#getIntersections();

        if(!intersections?.length){
            lights.forEach(l => l.state = "green");
        }

        const controlCenters = [];
        for (const light of lights) {
            const point = getNearestPoint(light.center, intersections);
            if (!point) {
                continue;
            }
            let controlCenter = controlCenters.find((c) => c.equals(point));
            if (!controlCenter) {
                controlCenter = new Point(point.x, point.y);
                controlCenter.lights = [light];
                controlCenters.push(controlCenter);
            } else {
                controlCenter.lights.push(light);
            }
        }

        const greenDuration = 2,
            yellowDuration = 1;
        for (const center of controlCenters) {
            center.ticks = center.lights.length * (greenDuration + yellowDuration);
        }
        const tick = Math.floor(this.frameCount / 60);
        for (const center of controlCenters) {
            const cTick = tick % center.ticks;
            const greenYellowIndex = Math.floor(
                cTick / (greenDuration + yellowDuration)
            );
            const greenYellowState =
                cTick % (greenDuration + yellowDuration) < greenDuration
                    ? "green"
                    : "yellow";
            for (let i = 0; i < center.lights.length; i++) {
                if (i == greenYellowIndex) {
                    center.lights[i].state = greenYellowState;
                } else {
                    center.lights[i].state = "red";
                }
            }
        }
        this.frameCount++;
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
        this.#updateLights();

        this.roadGeneratorAndDrawer.draw(ctx, this.debug);
        this.markings.forEach(m => m.draw(ctx, viewPoint));
        let items = [
            ...this.buildingGeneratorAndDrawer.buildings,
            ...this.treeGeneratorAndDrawer.trees,
        ];

        items
            .sort((a, b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint))
            .forEach(item => item.draw(ctx, viewPoint));
    }
}

export default World;
