import Graph from "./math/graph.js";
import RoadGeneratorAndDrawer from "./world/roadGeneratorAndDrawer.js";
import LaneGuidesGeneratorAndDrawer from "./world/laneGuidesGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./world/treeGeneratorAndDrawer.js";
import Light from "./markings/light.js";
import { getNearestPoint } from "./math/utils.js";
import Point from "./primitives/point.js";
import Envelope from "./primitives/envelope.js";
import Segment from "./primitives/segment.js";
import Building from "./items/building.js";
import Tree from "./items/tree.js";
import { TRAFFIC_LIGHT_GREEN, TRAFFIC_LIGHT_RED, TRAFFIC_LIGHT_YELLOW } from "./consts.js";
import MarkingLoader from "./markingLoader.js";
import Marking from "./markings/marking.js";
import Car from "../../js/views/car/car.js";
import Start from "./markings/start.js";

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

        /** @type {Marking[]} */
        this.markings = [];

        this.frameCount = 0;
        
        this.zoom = 1;
        this.offset = null;

        /** @type {Car[]} */
        this.cars = [];
        /** @type {Car} */
        this.bestCar;

        this.showStartMarkings = true;

        // this.generate();
    }

    /** @param {World} rawData */
    static load(rawData){
        const world = new World(
            Graph.load(rawData.graph),
            new RoadGeneratorAndDrawer(rawData.roadGeneratorAndDrawer.roadWidth, rawData.roadGeneratorAndDrawer.roadRoundness),
            new LaneGuidesGeneratorAndDrawer(),
            new BuildingGeneratorAndDrawer(
                rawData.buildingGeneratorAndDrawer.buildingWidth,
                rawData.buildingGeneratorAndDrawer.buildingMinLength,
                rawData.buildingGeneratorAndDrawer.betweenBuildingSpacing
            ),
            new TreeGeneratorAndDrawer(rawData.treeGeneratorAndDrawer.treeSize)
        )
        world.roadGeneratorAndDrawer.roadEnvelopes = rawData.roadGeneratorAndDrawer.roadEnvelopes.map(e => Envelope.load(e))
        world.roadGeneratorAndDrawer.pointToPointSegments = rawData.roadGeneratorAndDrawer.pointToPointSegments.map(s => Segment.load(s))
        world.roadGeneratorAndDrawer.roadBorders = rawData.roadGeneratorAndDrawer.roadBorders.map(b => Segment.load(b))
        world.laneGuidesGeneratorAndDrawer.laneGuides = rawData.laneGuidesGeneratorAndDrawer.laneGuides.map(s => Segment.load(s))
        world.markings = rawData.markings.map(m => new MarkingLoader().load(m));
        world.buildingGeneratorAndDrawer.buildings = rawData.buildingGeneratorAndDrawer.buildings.map(b => Building.load(b))
        world.treeGeneratorAndDrawer.trees = rawData.treeGeneratorAndDrawer.trees.map(t => Tree.load(t))
        world.zoom = rawData.zoom;
        world.offset = rawData.offset;

        return world;
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
            lights.forEach(l => l.state = TRAFFIC_LIGHT_GREEN);
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
                    ? TRAFFIC_LIGHT_GREEN
                    : TRAFFIC_LIGHT_YELLOW;
            for (let i = 0; i < center.lights.length; i++) {
                if (i == greenYellowIndex) {
                    center.lights[i].state = greenYellowState;
                } else {
                    center.lights[i].state = TRAFFIC_LIGHT_RED;
                }
            }
        }
        this.frameCount++;
    }

    dispose() {
        this.graph.dispose();
        this.markings.length = 0;
        this.roadGeneratorAndDrawer.pointToPointSegments.length = 0;
    }

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
        
        this.#updateLights();
        
        this.roadGeneratorAndDrawer.draw(ctx, this.debug);
        this.markings.forEach(m => {!(m instanceof Start) || this.showStartMarkings ? m.draw(ctx, viewPoint) : null});
        let items = [
            ...this.buildingGeneratorAndDrawer.buildings,
            ...this.treeGeneratorAndDrawer.trees,
        ];
        
        ctx.globalAlpha = 0.2;
        this.cars.forEach(car => car.draw(ctx))
        ctx.globalAlpha = 1;
        this.bestCar?.draw(ctx, true);
        
        items
            .sort((a, b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint))
            .forEach(item => item.draw(ctx, viewPoint));
    }
}

export default World;
