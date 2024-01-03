import Graph from "./math/graph.js";
import RoadGeneratorAndDrawer from "./world/roadGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./world/treeGeneratorAndDrawer.js";

class World {
    /**
     * @param {Graph} graph 
     * @param {RoadGeneratorAndDrawer} roadGeneratorAndDrawer 
     * @param {BuildingGeneratorAndDrawer} buildingGeneratorAndDrawer 
     * @param {TreeGeneratorAndDrawer} treeGeneratorAndDrawer 
     */
    constructor(
        graph, 
        roadGeneratorAndDrawer,
        buildingGeneratorAndDrawer,
        treeGeneratorAndDrawer
    ){
        this.graph = graph;
        this.roadGeneratorAndDrawer = roadGeneratorAndDrawer;
        this.buildingGeneratorAndDrawer = buildingGeneratorAndDrawer;
        this.treeGeneratorAndDrawer = treeGeneratorAndDrawer;

        this.debug = false;

        this.generate();
    }

    generate() {
        this.roadGeneratorAndDrawer.generate(this.graph);
        this.buildingGeneratorAndDrawer.generate(
            this.graph,
            this.roadGeneratorAndDrawer.width,
            this.roadGeneratorAndDrawer.roundness
        );
        this.treeGeneratorAndDrawer.generate(
            this.graph,
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
        let items = [
            ...this.buildingGeneratorAndDrawer.buildings,
            ...this.treeGeneratorAndDrawer.trees,
        ];

        items
            .sort((a, b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint))
            .forEach(i => i.draw(ctx, viewPoint));
        this.roadGeneratorAndDrawer.draw(ctx, this.debug);
        // this.buildingGeneratorAndDrawer.draw(ctx, viewPoint, this.debug);
        // this.treeGeneratorAndDrawer.draw(ctx, viewPoint);
    }
}

export default World;
