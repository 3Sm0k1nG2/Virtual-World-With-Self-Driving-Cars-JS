import { average, getFake3dPoint} from "../math/utils.js";
import Point from "../primitives/point.js";
import Polygon from "../primitives/polygon.js";

class Building {
    /**
     * @param {Polygon} polygon 
     * @param {number} height 
     */
    constructor(polygon, height = 200) {
       this.base = polygon;
       this.height = height;
    }
 
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Point} viewPoint 
     */
    draw(ctx, viewPoint) {
       const topPoints = this.base.points.map((p) =>
          getFake3dPoint(p, viewPoint, this.height * 0.6)
       );
       const ceiling = new Polygon(topPoints);
 
       const sides = [];
       for (let i = 0; i < this.base.points.length; i++) {
          const nextI = (i + 1) % this.base.points.length;
          const polygon = new Polygon([
             this.base.points[i], this.base.points[nextI],
             topPoints[nextI], topPoints[i]
          ]);
          sides.push(polygon);
       }
       sides.sort(
          (a, b) =>
             b.distanceToPoint(viewPoint) -
             a.distanceToPoint(viewPoint)
       );
 
       const baseMidpoints = [
          average(this.base.points[0], this.base.points[1]),
          average(this.base.points[2], this.base.points[3])
       ];
 
       const topMidpoints = baseMidpoints.map((p) =>
          getFake3dPoint(p, viewPoint, this.height)
       );
 
       const roofPolys = [
          new Polygon([
             ceiling.points[0], ceiling.points[3],
             topMidpoints[1], topMidpoints[0]
          ]),
          new Polygon([
             ceiling.points[2], ceiling.points[1],
             topMidpoints[0], topMidpoints[1]
          ])
       ];
       roofPolys.sort(
          (a, b) =>
             b.distanceToPoint(viewPoint) -
             a.distanceToPoint(viewPoint)
       );
 
       this.base.draw(ctx, { fill: "white", stroke: "rgba(0,0,0,0.2)", lineWidth: 20 });
       for (const side of sides) {
          side.draw(ctx, { fill: "white", stroke: "#AAA" });
       }
       ceiling.draw(ctx, { fill: "white", stroke: "white", lineWidth: 6 });
       for (const polygon of roofPolys) {
          polygon.draw(ctx, { fill: "#D44", stroke: "#C44", lineWidth: 8, join: "round" });
       }
    }
 }

export default Building;
