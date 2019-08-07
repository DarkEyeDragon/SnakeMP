import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from "./userInput.js";

let snakeX;
let snakeY;
let addBody = false;
export default class Snake {
    constructor(ctx, data) {
        this.scale = 16;
        this.color = data.color;
        this.snake = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.snake = data.snake;
        this.id = data.id;
        this.displayName = data.displayName;
        this.bodyLength = data.bodyLength;
        this.pressingRight = data.pressingRight;
        if (data.pressingRight) this.direction = ARROW_RIGHT;
        if (data.pressingLeft) this.direction = ARROW_LEFT;
        if (data.pressingUp) this.direction = ARROW_UP;
        if (data.pressingDown) this.direction = ARROW_DOWN;
    }
    setDirection(direction) {
        this.direction = direction;
    }

    //TODO finish
    draw() {
        for (let i = 0; i < this.snake.length; i++) {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.snake[i].x, this.snake[i].y, this.scale, this.scale);
        }
    }
    setHeadCoordinates(x,y){
        this.snake[0].x = x;
        this.snake[0].y = y;
    }
    getOldHead() {
        return {
            x: this.snake[0].x,
            y: this.snake[0].y
        };
    }
    drawPlayerName(playerName){
        this.ctx.fillStyle = "black";
        this.ctx.font = "15px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(playerName, this.snake[0].x, this.snake[0].y-10);
        //this.ctx.fillText(playerName,this.snake.x-10,this.snake.y-10);
    }
    getNewHead() {
        return {
            x: snakeX,
            y: snakeY
        };
    }

    hitsBorder(){
        if(this.snake[0].x > this.canvas.width-SCALE || this.snake[0].x < 0) return true;
        return this.snake[0].y > this.canvas.height-SCALE || this.snake[0].y < 0;
    }
    hitsSelf(){

    }

    addBody(amount = 1) {
        addBody = false;
    }

    getLength() {
        return this.snake.length;
    }
}