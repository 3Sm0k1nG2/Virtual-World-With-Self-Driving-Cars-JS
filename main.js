import Graph from "./js/math/graph.js";
import World from "./js/world.js";
import GraphEditor from "./js/graphEditor.js";
import Viewport from "./js/viewport.js";
import RoadGeneratorAndDrawer from "./js/world/roadGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./js/world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./js/world/treeGeneratorAndDrawer.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.width = 600;
canvas.height = 600;

const graph = new Graph();
load();
const roadGeneratorAndDrawer = new RoadGeneratorAndDrawer(100, 10);
const buildingGeneratorAndDrawer = new BuildingGeneratorAndDrawer(100, 110, 50);
const treeGeneratorAndDrawer = new TreeGeneratorAndDrawer();
const world = new World(
    graph,
    roadGeneratorAndDrawer,
    buildingGeneratorAndDrawer,
    treeGeneratorAndDrawer
);
world.debug = false;
const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);

let oldGraphHash = graph.hash()
animate();

function animate() {
    viewport.reset();

    if(graph.hash() != oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash()
    }
    world.draw(viewport.ctx);

    graphEditor.display();

    requestAnimationFrame(animate);
}

globalThis.dispose = () => {
    graphEditor.dispose();
}

globalThis.save = () => {
    localStorage.setItem("graph", JSON.stringify(graph));
}

globalThis.debug = () => {
    world.debug = !world.debug;
}

function load() {
    const data = localStorage.getItem("graph");

    if (!data) {
        return;
    }

    /** @type {{points: string[], segments: string[]}} */
    const graphData = JSON.parse(data);

    if (!graphData.points?.length || !graphData.segments?.length) {
        localStorage.removeItem("graph");
        return;
    }

    const savedGraph = Graph.load(graphData);

    graph.points = savedGraph.points;
    graph.segments = savedGraph.segments;
}
