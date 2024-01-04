import Graph from "./js/math/graph.js";
import World from "./js/world.js";
import GraphEditor from "./js/editors/graphEditor/graphEditor.js";
import Viewport from "./js/viewport.js";
import RoadGeneratorAndDrawer from "./js/world/roadGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./js/world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./js/world/treeGeneratorAndDrawer.js";
import { scale } from "./js/math/utils.js";
import StopEditor from "./js/editors/markingEditors/stopEditor.js";
import GraphEditorEvents from "./js/editors/graphEditor/graphEditorEvents.js";
import LaneGuidesGeneratorAndDrawer from "./js/world/laneGuidesGeneratorAndDrawer.js";
import CrossingEditor from "./js/editors/markingEditors/crossingEditor.js";
import StartEditor from "./js/editors/markingEditors/startEditor.js";
import YieldEditor from "./js/editors/markingEditors/yieldEditor.js";
import ParkingEditor from "./js/editors/markingEditors/parkingEditor.js";
import LightEditor from "./js/editors/markingEditors/lightEditor.js";
import TargetEditor from "./js/editors/markingEditors/targetEditor.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('world');
canvas.width = window.outerWidth * 0.9;
canvas.height = window.outerHeight * 0.6;

const graphBtn = document.getElementById('graphBtn');
const stopBtn = document.getElementById('stopBtn');
const yieldBtn = document.getElementById('yieldBtn');
const crossingBtn = document.getElementById('crossingBtn');
const parkingBtn = document.getElementById('parkingBtn');
const lightBtn = document.getElementById('lightBtn');
const startBtn = document.getElementById('startBtn');
const targetBtn = document.getElementById('targetBtn');

const graph = new Graph();
load();
const world = new World(
    graph,
    new RoadGeneratorAndDrawer(100, 10),
    new LaneGuidesGeneratorAndDrawer(),
    new BuildingGeneratorAndDrawer(100, 110, 50),
    new TreeGeneratorAndDrawer()
);
world.debug = false;
const viewport = new Viewport(canvas);

const tools = {
    editors: {
        graph: { button: graphBtn, editor: new GraphEditor(viewport, graph, new GraphEditorEvents()) },
        stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
        yield: { button: yieldBtn, editor: new YieldEditor(viewport, world)},
        crossing: { button: crossingBtn, editor: new CrossingEditor(viewport, world)},
        parking: { button: parkingBtn, editor: new ParkingEditor(viewport, world)},
        light: { button: lightBtn, editor: new LightEditor(viewport, world)},
        start: { button: startBtn, editor: new StartEditor(viewport, world)},
        target: { button: targetBtn, editor: new TargetEditor(viewport, world)},
    }
}
Object.freeze(tools);
Object.freeze(tools.editors);

let oldGraphHash = graph.hash();

setMode('graph');

animate();

function animate() {
    viewport.reset();

    if(graph.hash() != oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash()
    }
    world.draw(viewport.ctx, scale(viewport.getOffset(), -1));

    Object.values(tools.editors)
        .forEach(e => e.editor.display());

    requestAnimationFrame(animate);
}

globalThis.dispose = () => {
    tools.editors.graph.editor.dispose();
    world.markings.length = 0;
}

globalThis.save = () => {
    localStorage.setItem("graph", JSON.stringify(graph));
}

globalThis.debug = () => {
    world.debug = !world.debug;
}

globalThis.setMode = setMode;

/** @param {string} mode */
function setMode(mode) {
    disableEditors();

    if(!tools.editors[mode]){
        return;
    }

    const editorTool = tools.editors[mode];
    editorTool.button.style.backgroundColor = "white";
    editorTool.button.style.filter = "";

    editorTool.editor.enable();
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

function disableEditors() {
    Object.values(tools.editors)
        .forEach(editorTool => {
            editorTool.button.style.backgroundColor = "gray";
            editorTool.button.style.filter = "grayscale(100%)";
            editorTool.editor.disable();
        })
}
