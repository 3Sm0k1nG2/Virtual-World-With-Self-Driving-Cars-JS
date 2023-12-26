import Point from "./js/primitives/point.js";
import Segment from "./js/primitives/segment.js";
import Graph from "./js/math/graph.js";
import GraphEditor from "./js/graphEditor.js";
import Viewport from "./js/viewport.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.width = 600;
canvas.height = 600;

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1,p2,p3,p4], [s1,s2,s3,s4]);
const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();

function animate() {
    viewport.reset();

    graphEditor.display();

    requestAnimationFrame(animate);
}

globalThis.dispose = () => {
    graphEditor.dispose();
}

globalThis.save = () => {
    localStorage.setItem("graph", JSON.stringify(graph));
}

globalThis.load = () => {
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