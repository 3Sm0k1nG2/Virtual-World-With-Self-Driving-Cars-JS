import Point from "./js/primitives/point.js";
import Segment from "./js/primitives/segment.js";
import Polygon from "./js/primitives/polygon.js";
import Envelope from "./js/primitives/envelope.js";
import Graph from "./js/math/graph.js";
import World from "./js/world.js";
import GraphEditor from "./js/graphEditor.js";
import Viewport from "./js/viewport.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.width = 600;
canvas.height = 600;

const graph = new Graph();
load()
const world = new World(graph, 100, 10);
const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();

function animate() {
    viewport.reset();
    world.generate();
    world.draw(viewport.ctx);
    viewport.ctx.globalAlpha = 0.3;
    graphEditor.display();

    requestAnimationFrame(animate);
}

globalThis.dispose = () => {
    graphEditor.dispose();
}

globalThis.save = () => {
    localStorage.setItem("graph", JSON.stringify(graph));
}

function load () {
    const data = localStorage.getItem("graph");
    
    if(!data){
        return;
    }

    /** @type {{points: string[], segments: string[]}} */
    const graphData = JSON.parse(data);
    
    if(!graphData.points?.length || !graphData.segments?.length){
        localStorage.removeItem("graph");
        return;
    }

    const savedGraph = Graph.load(graphData);

    graph.points = savedGraph.points;
    graph.segments = savedGraph.segments;
}
