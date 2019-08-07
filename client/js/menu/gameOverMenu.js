import Menu from "./menu.js";

export default class GameOverMenu extends Menu{
    constructor(ctx){
        super(ctx);
        this.ctx = ctx;
        super.addText("Game Over", this.ctx.canvas.width/2, 300, 64);
        super.addButton("Submit score", this.ctx.canvas.width/2-50, 450, 100, 25);
        super.addButton("Retry", this.ctx.canvas.width/2-50, 450, 100, 25);
    }
    setScore(score){
        super.addText(`Score: ${score}`, this.ctx.canvas.width/2, 380, 32);
    }
}