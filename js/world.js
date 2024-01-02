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

    /** @param {CanvasRenderingContext2D} ctx */
    draw(ctx) {
        this.roadGeneratorAndDrawer.draw(ctx, this.debug);
        this.buildingGeneratorAndDrawer.draw(ctx, this.debug);
        this.treeGeneratorAndDrawer.draw(ctx, this.debug);
    }
}

export default World;
