const CONSTANTS = require("./constants");
let gridSize = CONSTANTS.gridSize;

let hasEaten;

class Player{
    constructor(id, displayName, x, y, color) {
        this.id = id;
        this.displayName = displayName;
        this.snake = [];
        this.snake[0] = {
            x: x,
            y: y
        };
        this.bodyLength = 1;
        this.score = 0;
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.color = color;
    }
    updatePosition(){
        let oldHead = {
            x: this.snake[0].x,
            y: this.snake[0].y
        };
        if(this.pressingRight){
            oldHead.x += gridSize;
        }
        if(this.pressingLeft){
            oldHead.x -= gridSize;
        }
        if(this.pressingUp){
            oldHead.y -= gridSize;
        }
        if(this.pressingDown){
            oldHead.y += gridSize;
        }
        if(!hasEaten){
            this.snake.pop();
        }else{
            hasEaten = false;
        }
        this.snake.unshift({x: oldHead.x, y: oldHead.y});

    }
    hasEaten(value){
        hasEaten = value;
    }
}
module.exports = Player;