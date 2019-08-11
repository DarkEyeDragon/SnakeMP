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

const app = express();

let http = require('http').createServer(app);
let io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client');
});
app.get('/generateid', (req, res) => {
    res.redirect("game/12345");
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

const SOCKET_LIST = new Map();
const LOBBY_LIST = new Map();
LOBBY_LIST.set("12345", null);
let food = new Food();
io.on('connection', (socket) => {
    console.log("Player connected on " + socket.id);
    socket.on('clientReady', () => {
        let foodObj = {x: food.x, y: food.y};
        let initObj = {scale: CONSTANTS.gridSize, food: foodObj};
        socket.emit('init', initObj);
        console.log(initObj);
    });

    let unique = uniqueId();
    let playerPosition = Environment.startPosition(SOCKET_LIST.values());
    socket.player = new Player(unique, unique, playerPosition.x, playerPosition.y, color());
    SOCKET_LIST.set(unique, socket);
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
const removePlayer = (player) => {
    SOCKET_LIST.delete(player.id);
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
        if (hitsSelf || hitsOther) {
            if (hitsOther) {
                SOCKET_LIST.get(collisionOther.otherPlayer.id).emit('death', collisionOther.otherPlayer.score);
                removePlayer(collisionOther.otherPlayer);
            }
            removePlayer(player);
            socket.emit('death', player.score);
        }
        player.updatePosition();
        segment.push(player);
    }
    for (let socket of SOCKET_LIST.values()) {
        socket.emit('gameTick', segment);
    }


}, 1000 / 15);