import Graph from "./math/graph.js";
import World from "./world.js";
import GraphEditor from "./editors/graphEditor/graphEditor.js";
import Viewport from "./viewport.js";
import RoadGeneratorAndDrawer from "./world/roadGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "./world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "./world/treeGeneratorAndDrawer.js";
import { scale } from "./math/utils.js";
import StopEditor from "./editors/markingEditors/stopEditor.js";
import GraphEditorEvents from "./editors/graphEditor/graphEditorEvents.js";
import LaneGuidesGeneratorAndDrawer from "./world/laneGuidesGeneratorAndDrawer.js";
import CrossingEditor from "./editors/markingEditors/crossingEditor.js";
import StartEditor from "./editors/markingEditors/startEditor.js";
import YieldEditor from "./editors/markingEditors/yieldEditor.js";
import ParkingEditor from "./editors/markingEditors/parkingEditor.js";
import LightEditor from "./editors/markingEditors/lightEditor.js";
import TargetEditor from "./editors/markingEditors/targetEditor.js";

globalThis.load = load;

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

let world = getSavedWorld() ?? new World(
    new Graph(),
    new RoadGeneratorAndDrawer(100, 10),
    new LaneGuidesGeneratorAndDrawer(),
    new BuildingGeneratorAndDrawer(100, 110, 50),
    new TreeGeneratorAndDrawer()
);
const graph = world.graph;
world.debug = false;
const viewport = new Viewport(canvas, world.zoom, world.offset);

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

    viewport.ctx.globalAlpha = 0.3

    Object.values(tools.editors)
        .forEach(e => e.editor.display());

    requestAnimationFrame(animate);
}

globalThis.dispose = () => {
    world.dispose();
}

globalThis.save = () => {
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const element = document.createElement('a');
    element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(world))
    )

    const filename = "name.world";
    element.setAttribute("download", filename);

    element.click();

    localStorage.setItem("world", JSON.stringify(world));
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

function getSavedWorld() {
    const data = localStorage.getItem("world");

    if (!data) {
        return;
    }

    /** @type {World} */
    const worldRawData = JSON.parse(data);

    if (!worldRawData?.graph) {
        localStorage.removeItem("world");
        return;
    }

    return World.load(worldRawData);
}

function load(event) {
    const file = event.target.files[0];

    if(!file) {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = (evt) => {
        const fielContent = evt.target.result;
        const JSONData = JSON.parse(fielContent);
        world = World.load(JSONData);
        localStorage.setItem("world", JSON.stringify(world));
        location.reload();
    }
}

function disableEditors() {
    Object.values(tools.editors)
        .forEach(editorTool => {
            editorTool.button.style.backgroundColor = "gray";
            editorTool.button.style.filter = "grayscale(100%)";
            editorTool.editor.disable();
        })
}
