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

        document.getElementById('game_popup').style.display = 'none';

        SCALE = initData.scale;
        food = new Food(ctx, initData.food.x, initData.food.y);
        isSetup = true;
    });
    socket.on('game_error', (errorMessage)=>{
        let domError = document.getElementById('game_error');
        domError.innerHTML = errorMessage;
        domError.style.display = 'block';
        setTimeout(()=> {
            domError.style.display = 'none';
        }, 1500);

    });

    socket.on('playerdeath', (data) => {
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