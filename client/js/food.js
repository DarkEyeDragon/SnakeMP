import Box from "./box.js";
import GameObject from "./gameObject.js";

export default class Food extends GameObject {
    constructor(ctx, x, y) {
        super(ctx);
        this.x = x;
        this.y = y;
    }

    draw() {
        super.draw(this.x, this.y, "red");
    }
}