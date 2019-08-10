import Snake from "./snake.js";
import GameOverMenu from "./menu/gameOverMenu.js";
import Food from "./food.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let snakeList = new Map();
let food;
export let SCALE;
let isSetup = false;


socket.on("gameTick", (data) => {
    if(!isSetup) return;
    ctx.clearRect(0, 0, 800, 800);
    snakeList.clear();
    for (let i = 0; i < data.length; i++) {
        let snake = new Snake(ctx, data[i]);
        snakeList.set(data[i].id, snake);
    }
    for (let snake of snakeList.values()) {
        snake.drawDisplayName();
        snake.draw();
    }
    food.draw();
});

socket.on("init", (data) => {
    SCALE = data.scale;
    console.log("Init");
    isSetup = true;
});
socket.on("updateFood", (data) => {
    food = new Food(ctx, data.x, data.y);
});
socket.on("death", (score) => {
    let gameOverMenu = new GameOverMenu(ctx);
    gameOverMenu.setScore(score);
    gameOverMenu.draw();
});

