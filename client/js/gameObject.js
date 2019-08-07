import {SCALE} from "./rendering.js";

export default class GameObject {
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw(x, y, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect( x, y, SCALE, SCALE);
    }
}