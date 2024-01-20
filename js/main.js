import Car from "./views/car/car.js";
import { CONTROL_TYPE_AI } from "./consts.js";
import Road from "./views/car/road.js";
import Visualizer from "./views/network/visualizer.js";
import OfflineStorage from "./offlineStorage.js";
import AIManager from "./AIManager.js";
import NeuralNetworkManager from "./ai/neural-network/neuralNetworkManager.js";
import TrafficGenerator from "./trafficGenerator.js";
import EventListenerModuleBuilder from "./common/eventListenerModuleBuilder.js"
import { carEventTypes } from "./views/car/carEvents.js";
import CarAITrainer from "./aiTrainer/car/carAITrainer.js";

/** @type {HTMLCanvasElement} */
const carCanvas = document.getElementById('carCanvas');
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

/** @type {HTMLCanvasElement} */
const networkCanvas = document.getElementById('networkCanvas');
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carContext = carCanvas.getContext("2d");
const networkContext = networkCanvas.getContext("2d");

const aiManager = new AIManager(
    new NeuralNetworkManager(),
    new OfflineStorage(localStorage)
);

const carN = 125;
const mutator = 1;

const road = new Road(
    carCanvas.width / 2,
    carCanvas.width * 0.9,
    5
);

const eventListenerModuleBuilder = new EventListenerModuleBuilder();
eventListenerModuleBuilder.registerEvents(...Object.keys(carEventTypes));
const cars = generateCars(eventListenerModuleBuilder, carN);
const carAiTrainer = new CarAITrainer(cars);

const traffic = new TrafficGenerator(
    road,
    cars[0].height,
    // new ColorGenerator()
).generateSequantically(
        [],
        [0, 2, 4],
        [1, /*2,*/ 3],
        [0, 4],
        [1, 2, 3],
        [0, 2, 4],
        [0, 1, 3, 4],
        [0, 4],
        [0, 2, 4],
        [1, 3],
        [0, 4],
        [1, 2, 3],
        [0, 4],
        [0, 1, 2/*, 3*/],
        [1, 2, 3, 4],
        [0, 4],
    );

const visualizer = new Visualizer();

let bestCar = cars[0];
if (aiManager.bestBrain) {
    aiManager.mutateCars(cars, mutator);
}

let previewAll = true;
let pause = false;
if(!localStorage.getItem('autoTrain')) {
    localStorage.setItem('autoTrain', false);
}
let autoTrain = localStorage.getItem('autoTrain') === "true";
init(aiManager);


updateTick();

/** @param {DOMHighResTimeStamp} time */
function updateTick(time) {
    if (!pause) {
        for(let subjectId in carAiTrainer.subjects) {
            carAiTrainer.subjects[subjectId].object.update([...road.borders, ...traffic.map(v => v.polygon.borders).reduce((prev, curr) => [...prev, ...curr])], aiManager.neuralNetworkManager);
        }
        traffic.forEach(v => v.update([...road.borders], aiManager.neuralNetworkManager));

        carAiTrainer.refreshBestSubject();

        animate(time);
    }

    requestAnimationFrame(updateTick);
}

/** @param {DOMHighResTimeStamp} time */
function animate(time) {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carContext.reset();

    carContext.save();
    if(carAiTrainer.bestSubject){
        carContext.translate(0, -carAiTrainer.bestSubject.object.y + carCanvas.height * 0.7);
    }

    road.draw(carContext);
    traffic.forEach(v => v.draw(carContext));
    carContext.globalAlpha = 0.2;
    if (previewAll) {
        for(let subjectId in carAiTrainer.subjects) {
            carAiTrainer.subjects[subjectId].object.draw(carContext);
        }
    }
    carContext.globalAlpha = 1;
    carAiTrainer.bestSubject.object.draw(carContext, true);

    carContext.restore();

    networkContext.lineDashOffset = -time * 0.01;
    if(carAiTrainer.bestSubject){
        visualizer.drawNetwork(networkContext, carAiTrainer.bestSubject.object.brain);
    }
}

/**
 * @param {EventListenerModuleBuilder} eventListenerModuleBuilder 
 * @param {number} count 
 */
function generateCars(eventListenerModuleBuilder, count) {
    const cars = [];

    for (let i = 0; i < count; i++) {
        cars.push(new Car({
            eventListenerModule: eventListenerModuleBuilder.build(),
            x: road.getLaneCenterByIndex(Math.floor(road.laneCount / 2)),
            y: 100,
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
            aiManager.changeBrain(bestCar.brain);
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
    document.getElementById("autoTrainAction").style.backgroundColor = autoTrain ? 'lime' : 'red';
    document.getElementById("autoTrainAction")
        .addEventListener('click', (e) => {
            autoTrain = !autoTrain;
            localStorage.setItem('autoTrain', autoTrain);
            e.target.style.backgroundColor = autoTrain ? 'lime' : 'red';

            location.reload()
        });
    document.addEventListener('click', (e) => {
        pause = !pause;
    })
    document.getElementById('actions')
        .addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault() });

    if(autoTrain){
        setTimeout(() => {aiManager.changeBrain(carAiTrainer.bestSubject.object.brain); aiManager.storeBestBrain(); location.reload()}, 25 * 1000)
    }
}
