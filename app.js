const createError = require('http-errors');
const CONSTANTS = require("./server/constants");
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Player = require('./server/player');
const uniqueId = require('./server/generateId');
const color = require('rcolor');
const Environment = require("./server/environment");
const Food = require("./server/food");
const bodyParser = require("body-parser");
const InputValidation = require("./server/inputvalidation");

const app = express();

let http = require('http').createServer(app);
let io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client');
});
app.get('/generateid', (req, res) => {
    console.log(req.body);
    //if(LOBBY_LIST.has())
    //res.redirect("game/12345");
});
app.post('/joingame', (req, res) => {
    console.log(req.body);
    if (LOBBY_LIST.has(req.body.gameId)) {
        res.redirect(`game/${req.body.gameId}`);
    } else {
        res.redirect("/");
    }
});

app.get('/game/:id', (req, res) => {
    console.log(LOBBY_LIST);
    if (LOBBY_LIST.has(req.params.id))
        res.sendFile(__dirname + '/client/game.html');
    else
        res.redirect('/');
});
app.use(express.static(__dirname + '/client'));

/*// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});*/

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

//Create a little noob bot to test collisions
/*let bot = new Player("bot", "Bot Mohammed", 16 * 6, 16 * 6, "black");
bot.snake[1] = {x: 16 * 5, y: 16 * 6};
bot.snake[2] = {x: 16 * 4, y: 16 * 6};
bot.snake[3] = {x: 16 * 3, y: 16 * 6};
bot.snake[4] = {x: 16 * 2, y: 16 * 6};
bot.snake[5] = {x: 16, y: 16 * 6};*/

const SOCKET_LIST = new Map();
const LOBBY_LIST = new Map();
const BOT_LIST = new Map();
const FOOD_LIST = [];


LOBBY_LIST.set("12345", null);
//BOT_LIST.set("bot", {player: bot, id: bot.id});
let food = new Food();
io.on('connection', (socket) => {
    console.log("Player connected on " + socket.id);
    socket.on('clientReady', (username) => {
        if(SOCKET_LIST.has(socket.id)) return;
        if(InputValidation.isValidUsername(username)){
            let foodObj = {x: food.x, y: food.y};
            let initObj = {scale: CONSTANTS.gridSize, food: foodObj};
            socket.emit('init', initObj);
        }else{
            socket.emit('game_error', CONSTANTS.ERRORS.INVALID_USERNAME);
            return;
        }

        let playerPosition = Environment.startPosition(SOCKET_LIST.values());
        socket.player = new Player(socket.id, username, playerPosition.x, playerPosition.y, color());
        SOCKET_LIST.set(socket.id, socket);
        socket.on('disconnect', () => {
            removePlayer(socket.player);
            console.log(socket.player.id + "disconnected");
            /*if(SOCKET_LIST.size === 0){
                clearInterval(gameLoop);
            }*/
        });

        socket.on('keyPress', (data) => {
            const player = socket.player;
            player.direction = data;
        });
    });
});
const removePlayer = (player) => {
    return SOCKET_LIST.delete(player.id);
};
const removeBot = (bot) => {
    return BOT_LIST.delete(bot.id);
};
//Set the game tick to 15fps
const gameLoop = setInterval(() => {
    let segment = [];
    for (let socket of SOCKET_LIST.values()) {
        let player = socket.player;
        //Player hits border
        if (Environment.hitsBorder(player)) {
            removePlayer(player);
            socket.emit('death', player.score);
            //Player hits food
        } else if (player.snake[0].x === food.x && player.snake[0].y === food.y) {
            food.generateRandom();
            player.bodyLength++;
            player.score++;
            player.hasEaten(true);
            io.emit('updateFood', {x: food.x, y: food.y});
        }
        let collisionSelf = Environment.hitsSelf(player);
        let collisionOther = Environment.hitsOther(player, SOCKET_LIST.values());
        let hitsSelf = collisionSelf.isCollision;
        let hitsOther = collisionOther.isCollision;

        let collisionBot = Environment.hitsOther(player, BOT_LIST.values());
        let hitsBot = collisionBot.isCollision;
        if (hitsOther) {
            if (collisionOther.type === CONSTANTS.collision.HEAD_TO_BODY) {
                socket.broadcast.emit('playerdeath', collisionOther);
                SOCKET_LIST.get(collisionOther.target.id).emit('death', collisionOther.target.score);
                removePlayer(collisionOther.player);
                console.log("Hit other - head to body");
            } else if (collisionOther.type === CONSTANTS.collision.HEAD_TO_HEAD) {
                removePlayer(collisionOther.player);
                removePlayer(collisionOther.target);
                console.log("Hit other - head to head");
                socket.emit('death', player.score);
            }
        } else if (hitsBot) {
            if (collisionBot.type === CONSTANTS.collision.HEAD_TO_BODY) {
                socket.broadcast.emit('playerdeath', collisionOther);
                removePlayer(collisionBot.player);
                console.log("Hit bot - head to body");
            } else if (collisionBot.type === CONSTANTS.collision.HEAD_TO_HEAD) {
                removePlayer(collisionBot.player);
                removeBot(collisionBot.target);
                socket.emit('death', player.score);
                console.log("Hit bot - head to head");
            }
        } else if (hitsSelf) {
            removePlayer(player);
            socket.emit('death', player.score);
        }
        player.updatePosition();
        segment.push(player);

    }
    for (let bot of BOT_LIST.values()) {
        segment.push(bot.player);
    }
    for (let socket of SOCKET_LIST.values()) {
        socket.emit('gameTick', segment);
    }


}, 1000 / 15);