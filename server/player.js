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
        this.bodyLength = this.snake.length;
        this.score = 0;
        this.direction = null;
        this.color = color;
    }

    collided(){
        if(this.collidedSelf()) return true;
        if(this.collidedWall()) return true;
    }

    collidedWall(){
        if (this.snake[0].x > CONSTANTS.gridWidth - CONSTANTS.gridSize || this.snake[0].x < 0) return true;
        return this.snake[0].y > CONSTANTS.gridHeight - CONSTANTS.gridSize || this.snake[0].y < 0;
    }

    collidedSelf(){
        const head = this.snake[0];
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    }

    /*check collisions with other players*/
    collidedOther(socketList){
        for (let socket of socketList){
            let player = socket.player;
            for (let snakeBodyPart of this.snake ){
                for (let otherSnakeBodyPart of player.snake){
                    if(player.id === this.id){
                        break;
                    }
                    if(snakeBodyPart.x === otherSnakeBodyPart.x && snakeBodyPart.y === otherSnakeBodyPart.y){
                        return socket;
                    }
                }
            }
        }
        return null;
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
        this.score++;
        this.bodyLength = this.snake.length;
    }
}
module.exports = Player;