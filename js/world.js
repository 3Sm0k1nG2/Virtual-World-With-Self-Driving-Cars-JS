import Graph from "./math/graph.js";
import RoadGeneratorAndDrawer from "./world/roadGeneratorAndDrawer.js";
import LaneGuidesGeneratorAndDrawer from "./world/laneGuidesGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./world/treeGeneratorAndDrawer.js";

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
    ){
        this.graph = graph;
        this.roadGeneratorAndDrawer = roadGeneratorAndDrawer;
        this.laneGuidesGeneratorAndDrawer = laneGuidesGeneratorAndDrawer;
        this.buildingGeneratorAndDrawer = buildingGeneratorAndDrawer;
        this.treeGeneratorAndDrawer = treeGeneratorAndDrawer;

        this.debug = false;

        this.markings = [];

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

    /** 
     * @param {CanvasRenderingContext2D} ctx
     * @param {Point} viewPoint
     */
    draw(ctx, viewPoint) {
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
