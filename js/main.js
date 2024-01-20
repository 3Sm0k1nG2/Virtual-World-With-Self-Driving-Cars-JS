import Car from "./views/car/car.js";
import { CONTROL_TYPE_AI, CONTROL_TYPE_KEYS } from "./consts.js";
import Visualizer from "./views/network/visualizer.js";
import OfflineStorage from "./offlineStorage.js";
import AIManager from "./AIManager.js";
import NeuralNetworkManager from "./ai/neural-network/neuralNetworkManager.js";
import TrafficGenerator from "./trafficGenerator.js";
import EventListenerModuleBuilder from "./common/eventListenerModuleBuilder.js"
import { carEventTypes } from "./views/car/carEvents.js";
import CarAITrainer from "./aiTrainer/car/carAITrainer.js";

import Graph from "../world/js/math/graph.js";
import World from "../world/js/world.js";
import GraphEditor from "../world/js/editors/graphEditor/graphEditor.js";
import Viewport from "../world/js/viewport.js";
import RoadGeneratorAndDrawer from "../world/js/world/roadGeneratorAndDrawer.js";
import BuildingGeneratorAndDrawer from "../world/js/world/buildingGeneratorAndDrawer.js";
import TreeGeneratorAndDrawer from "../world/js/world/treeGeneratorAndDrawer.js";
import { angle, scale } from "../world/js/math/utils.js";
import StopEditor from "../world/js/editors/markingEditors/stopEditor.js";
import GraphEditorEvents from "../world/js/editors/graphEditor/graphEditorEvents.js";
import LaneGuidesGeneratorAndDrawer from "../world/js/world/laneGuidesGeneratorAndDrawer.js";
import CrossingEditor from "../world/js/editors/markingEditors/crossingEditor.js";
import StartEditor from "../world/js/editors/markingEditors/startEditor.js";
import YieldEditor from "../world/js/editors/markingEditors/yieldEditor.js";
import ParkingEditor from "../world/js/editors/markingEditors/parkingEditor.js";
import LightEditor from "../world/js/editors/markingEditors/lightEditor.js";
import TargetEditor from "../world/js/editors/markingEditors/targetEditor.js";
import Start from "../world/js/markings/start.js";
import Point from "./views/car/point.js";

const world = getSavedWorld() ?? new World(
    new Graph(),
    new RoadGeneratorAndDrawer(100, 10),
    new LaneGuidesGeneratorAndDrawer(),
    new BuildingGeneratorAndDrawer(100, 110, 50),
    new TreeGeneratorAndDrawer()
);

world.debug = false;

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

/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = window.innerWidth - 330;

const viewport = new Viewport(carCanvas, world.zoom, world.offset);


/** @type {HTMLCanvasElement} */
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

carCanvas.height = window.innerHeight;
networkCanvas.height = window.innerHeight;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");



const aiManager = new AIManager(
    new NeuralNetworkManager(),
    new OfflineStorage(localStorage)
);

const carN = 100;
const mutator = 0.15;

const eventListenerModuleBuilder = new EventListenerModuleBuilder();
eventListenerModuleBuilder.registerEvents(...Object.keys(carEventTypes));
const carAiTrainer = new CarAITrainer(generateCars(eventListenerModuleBuilder, carN));

const traffic = [];
const roadBorders = world.roadGeneratorAndDrawer.roadBorders;

if(aiManager.bestBrain) {
    carAiTrainer.bestSubject.object.brain = aiManager.bestBrain;
}

world.cars = Object.values(carAiTrainer.subjects).map(s => s.object);
world.bestCar = carAiTrainer.bestSubject.object;
world.showStartMarkings;

viewport.offset.x = -world.bestCar.x;
viewport.offset.y = world.bestCar.y;

const visualizer = new Visualizer();

const neuralNetworkManager = new NeuralNetworkManager();
carAiTrainer.mutateCars(neuralNetworkManager, mutator);

let previewAll = true;
let isPaused = false;
if(!localStorage.getItem('autoTrain')) {
    localStorage.setItem('autoTrain', false);
}
let autoTrain = localStorage.getItem('autoTrain') === "true";
init(aiManager);


updateTick();

/** @param {DOMHighResTimeStamp} time */
function updateTick(time) {
    if (!isPaused) {
        for(let subjectId in carAiTrainer.subjects) {
            carAiTrainer.subjects[subjectId].object.update([...roadBorders, ...(traffic.length ? traffic.map(v => v.polygon.borders).reduce((prev, curr) => [...prev, ...curr]) : [])], neuralNetworkManager);
        }
        traffic.forEach(v => v.update([...roadBorders], neuralNetworkManager));

        carAiTrainer.refreshBestSubject();
        world.bestCar = carAiTrainer.bestSubject.object;
        
        viewport.offset.x = -world.bestCar.x;
        viewport.offset.y = -world.bestCar.y;

        console.log(Object.keys(carAiTrainer.subjects).length);

        animate(time);
    }

    requestAnimationFrame(updateTick);
}

/** @param {DOMHighResTimeStamp} time */
function animate(time) {
    viewport.reset();
    world.draw(viewport.ctx, scale(viewport.getOffset(), -1));

    traffic.forEach(v => v.draw(carContext));

    networkContext.lineDashOffset = -time * 0.01;
    if(carAiTrainer.bestSubject){
        networkContext.clearRect(0,0, networkContext.canvas.width, networkContext.canvas.height)
        visualizer.drawNetwork(networkContext, carAiTrainer.bestSubject.object.brain);
    }
}

/**
 * @param {EventListenerModuleBuilder} eventListenerModuleBuilder 
 * @param {number} count 
 */
function generateCars(eventListenerModuleBuilder, count) {
    const startPoints = world.markings.filter(m => m instanceof Start);
    const startPoint = startPoints[0]?.center ?? new Point(100, 100);
    const dir = startPoints[0]?.directionVector ?? new Point(0, -1);
    const startAngle = -angle(dir) + Math.PI / 2;

    const cars = [];

    for (let i = 0; i < count; i++) {
        cars.push(new Car({
            eventListenerModule: eventListenerModuleBuilder.build(),
            x: startPoint.x,
            y: startPoint.y,
            angle: startAngle,
            width: 30,
            height: 50,
            controlType: CONTROL_TYPE_AI,
            color: "blue",
            maxSpeed: 3,
        }))
    }

    return cars;
}

/** @param {AIManager} aiManager */
function init(aiManager) {
    document.getElementById("saveAction")
        .addEventListener('click', (e) => {
            aiManager.changeBrain(carAiTrainer.bestSubject.object.brain);
            aiManager.storeBestBrain()
        });
    document.getElementById("clearAction")
        .addEventListener('click', (e) => {
            aiManager.removeBestBrain()
        });
    document.getElementById("previewAction").style.backgroundColor = previewAll ? 'lime' : 'red';
    document.getElementById("previewAction")
        .addEventListener('click', (e) => {
            previewAll = !previewAll;
            e.target.style.backgroundColor = previewAll ? 'lime' : 'red';
        });
    document.getElementById("pauseAction").style.backgroundColor = isPaused ? 'lime' : 'red';
    document.getElementById("pauseAction")
        .addEventListener('click', (e) => {
            isPaused = !isPaused;
            e.target.style.backgroundColor = isPaused ? 'lime' : 'red';
        });
    document.getElementById("autoTrainAction").style.backgroundColor = autoTrain ? 'lime' : 'red';
    document.getElementById("autoTrainAction")
        .addEventListener('click', (e) => {
            autoTrain = !autoTrain;
            localStorage.setItem('autoTrain', autoTrain);
            e.target.style.backgroundColor = autoTrain ? 'lime' : 'red';

            location.reload()
        });
    document.getElementById('actions')
        .addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault() });

    if(autoTrain){
        setTimeout(() => {aiManager.changeBrain(carAiTrainer.bestSubject.object.brain); aiManager.storeBestBrain(); location.reload()}, 10 * 1000)
    }
}
