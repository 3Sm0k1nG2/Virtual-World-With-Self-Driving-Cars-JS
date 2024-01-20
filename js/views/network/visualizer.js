import Level from "../../ai/neural-network/level.js";
import NeuralNetwork from "../../ai/neural-network/network.js";
import Pos from "./pos.js"
import Node from "./node.js"
import Offset from "./offset.js"
import Connection from "./connection.js"
import RGBA from "../common/rgba.js"
import BiasNode from "./biasNode.js"
import { lerp } from "../car/utils.js";

class Visualizer {
    constructor() {

    }

    /**
     * @param {CanvasRenderingContext2D} context 
     * @param {NeuralNetwork} network 
     */
    drawNetwork(context, network) {
        const margin = 50;

        const top = margin;
        const left = margin;

        const width = context.canvas.width - margin*2;
        const height = context.canvas.height - margin*2;

        const levelHeight = height / network.levels.length;

        let levelTop = top;

        context.setLineDash([7, 3]);
        this.drawLevel(
            context,
            network.levels[network.levels.length-1],
            new Offset(
                levelTop,
                left,
                levelTop + levelHeight,
                left + width
            ),
            ['⇧', '⇦', '⇨', '⇩']
        );

        for(let i = network.levels.length - 2; i >= 0; i--) {
            levelTop = top
                + lerp(
                    height - levelHeight,
                    0,
                    network.levels.length === 1
                        ? 0.5
                        : i / (network.levels.length-1)
                )

            context.setLineDash([7, 3]);
            this.drawLevel(
                context,
                network.levels[i],
                new Offset(
                    levelTop,
                    left,
                    levelTop + levelHeight,
                    left + width
                )
            );
        }
    }

    /**
     * @param {CanvasRenderingContext2D} context
     * @param {Level} level
     * @param {Offset} offset
     * @param {string[]} labels
     */
    drawLevel(context, level, offset, labels = []) {
        const nodeRadius = 18;

        const { inputs, outputs, weights, biases } = level;

        const inputNodes = inputs
            .map((value, i) => new Node(
                new Pos(
                    this.#calcNodeX(inputs.length, i, offset.left, offset.right),
                    offset.bottom
                ),
                value
            ));

        const outputNodes = outputs
            .map((value, i) => new Node(
                new Pos(
                    this.#calcNodeX(outputs.length, i, offset.left, offset.right),
                    offset.top
                ),
                value
            ));

        const connections = this.#createConnections(inputNodes, outputNodes, weights);
        
        this.#drawConnections(context, connections, offset);
        
        this.#drawBiasNodes(
            context,
            inputNodes.map((node, i) => new BiasNode(node)),
            nodeRadius
        );
        this.#drawBiasNodes(
            context,
            outputNodes.map((node, i) => new BiasNode(node, biases[i])),
            nodeRadius
        );

        if(labels?.length) {
            for(let i in outputNodes) {
                this.#drawSymbol(
                    context,
                    outputNodes[i].pos,
                    labels[i],
                    nodeRadius
                );
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Pos} pos 
     * @param {string} sym 
     */
    #drawSymbol(ctx, pos, sym, nodeRadius) {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.font = `bold ${nodeRadius * 1.1}px Arial`;
        ctx.fillStyle = "white";

        ctx.fillText(
            sym,
            pos.x + nodeRadius * 0.005,
            pos.y + nodeRadius * 0.05
        );
    }

    /**
     * @param {Node[]} inputs 
     * @param {Node[]} outputs
     * @param {number[]} weights
     */
    #createConnections(inputs, outputs, weights) {
        const connections = [];
        
        for(let i in inputs) {
            connections.push(new Connection(inputs[i], outputs, weights[i]));
        }

        return connections;
    }

    /**
     * @param {CanvasRenderingContext2D} context 
     * @param {Connection[]} connections 
     */
    #drawConnections(ctx, connections) {
        for(let connection of connections) {
            for(let connectedNode of connection.connectedNodes) {
                this.#drawLine(
                    ctx,
                    connection.node.pos,
                    connectedNode.node.pos,
                    this.#generateColor(connectedNode.weight)
                )
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Pos} posA
     * @param {Pos} posB
     * @param {RGBA} color
     */
    #drawLine(ctx, posA, posB, color = new RGBA(255,255,255,1)) {
        ctx.beginPath();

        ctx.moveTo(posA.x, posA.y);
        ctx.lineTo(posB.x, posB.y);

        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    /** @param {number} value Fraction between 0 and 1 */
    #generateColor(value) {
        return new RGBA(
            value < 0 ? 255 : 0,
            value < 0 ? 0 : 255,
            0,
            Math.abs(value)
        );
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {BiasNode[]} nodes 
     * @param {number} radius 
     */
    #drawBiasNodes(ctx, nodes, radius) {
        for(let {node, bias} of nodes) {
            this.#drawNode(ctx, node, radius, "black");
            this.#drawNode(ctx, node, radius * 0.6, this.#generateColor(node.value));
            
            if(bias){
                this.#drawCircleStroke(ctx, node.pos, radius * 0.8, this.#generateColor(bias));
            }
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Node[]} nodes 
     * @param {number} radius 
     * @param {string} color 
     */
    #drawNodes(ctx, nodes, radius, color) {
        for(let node of nodes) {
            this.#drawNode(ctx, node, radius, color);
        }
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Node} node
     * @param {number} radius 
     * @param {string} color 
     */
    #drawNode(ctx, node, radius, color) {
        this.#drawCircleFill(ctx, node.pos, radius, color);
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Pos} pos 
     * @param {number} radius 
     * @param {RGBA} color 
     */
    #drawCircleFill(ctx, pos, radius, color = new RGBA(255,255,255,1)) {
        ctx.beginPath();

        ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2);
        ctx.fillStyle = color;

        ctx.fill();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Pos} pos 
     * @param {number} radius 
     * @param {RGBA} color
     */
    #drawCircleStroke(ctx, pos, radius, color = new RGBA(255,255,255,1)) {
        ctx.beginPath();

        ctx.arc(pos.x, pos.y, radius, 0, Math.PI*2);
        ctx.strokeStyle = color;
        ctx.setLineDash([3,3]);
 
        ctx.stroke();

        ctx.setLineDash([]);
    }

    /**
     * @param {number} nodesLength 
     * @param {number} index 
     * @param {number} left 
     * @param {number} right 
     * @returns 
     */
    #calcNodeX(nodesLength, index, left, right) {
        return lerp(
            left,
            right,
            nodesLength === 1
            ? 0.5
            : index / (nodesLength-1)
        )
    }
}

export default Visualizer;
