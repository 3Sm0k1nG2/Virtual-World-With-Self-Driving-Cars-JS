import Point from "../primitives/point.js";
import Segment from "../primitives/segment.js";
import { degToRad, invLerp } from "./utils.js";

class Osm {
    
    /** 
     * @param {{{type: "node" | string}[]}} data
     * @param {HTMLCanvasElement} canvas
     */
    parseRoads(data, canvas) {
        const nodes = data.elements.filter(n => n.type === "node");

        const lats = nodes.map(n => n.lat);
        const lons = nodes.map(n => n.lon);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const deltaLat = maxLat - minLat;
        const deltaLon = maxLon - minLon;
        const ar = deltaLon / deltaLat;
        const height = deltaLat * 110000 * 10;
        const width = height * ar * Math.cos(degToRad(maxLat));

        const points = [];
        let x, y;
        let point;
        for(let node of nodes) {
            y = invLerp(minLat, maxLat, node.lat) * height * -1;
            x = invLerp(minLon, maxLon, node.lon) * width;

            point = new Point(x, y);
            point.id = node.id;
            points.push(point);
        }

        const ways = data.elements.filter(w => w.type === "way");
        
        const segments = [];
        let ids;
        let prev, curr;
        let oneWay;
        for(let way of ways){
            ids = way.nodes;

            for(let i = 1; i < ids.length; i++){
                prev = points.find(p => p.id === ids[i-1]);
                curr = points.find(p => p.id === ids[i]);

                oneWay = way.tags.oneway || way.tags.lanes == 1;
                
                segments.push(new Segment(prev, curr, oneWay));
            }
        }

        return {
            points,
            segments
        }
    }
}

export default Osm;
