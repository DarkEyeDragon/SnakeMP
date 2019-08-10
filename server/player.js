const CONSTANTS = require("./constants");
const ARROW_DOWN = CONSTANTS.ARROW_DOWN;
const ARROW_UP = CONSTANTS.ARROW_UP;
const ARROW_LEFT = CONSTANTS.ARROW_LEFT;
const ARROW_RIGHT = CONSTANTS.ARROW_RIGHT;
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
        this.direction = null;
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
        if(this.direction === ARROW_RIGHT){
            oldHead.x += gridSize;
        }
        if(this.direction === ARROW_LEFT){
            oldHead.x -= gridSize;
        }
        if(this.direction === ARROW_UP){
            oldHead.y -= gridSize;
        }
        if(this.direction === ARROW_DOWN){
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