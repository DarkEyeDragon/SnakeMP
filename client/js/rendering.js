import Snake from "./snake.js";
import GameOverMenu from "./menu/gameOverMenu.js";
import Food from "./food.js";
import ResourceHandler from "./resourceHandler.js";


export let SCALE;

window.onload = function () {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    let snakeList = new Map();
    let food;
    let isSetup = false;

    let playerFeed = [];
    let resourceHandler = new ResourceHandler();
    resourceHandler.loadImages();
    socket.on("gameTick", (data) => {
        if (!isSetup) return;
        ctx.clearRect(0, 0, 1920, 960);
        snakeList.clear();
        for (let i = 0; i < data.length; i++) {
            let snake = new Snake(ctx, data[i]);
            snakeList.set(data[i].id, snake);
        }
        for (let snake of snakeList.values()) {
            snake.drawDisplayName(snake.displayName);
            snake.draw();
        }
        food.draw();
    });
    socket.on('init', (initData) => {
        SCALE = initData.scale;
        food = new Food(ctx, initData.food.x, initData.food.y);
        isSetup = true;
    });
    socket.emit('clientReady');

    socket.on('playerdeath', (data) => {
        console.log(data);
        if (data.type === 1) {

        }
    });

    socket.on('updateFood', (data) => {
        food = new Food(ctx, data.x, data.y);
    });
    socket.on('death', (score) => {
        let gameOverMenu = new GameOverMenu(ctx);
        gameOverMenu.setScore(score);
        gameOverMenu.draw();
    });


};