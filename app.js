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

app.get('/', (req, res)=> {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + '/client'));

/*// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});*/

// error handler
app.use((err, req, res, next)=> {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Listen for post data
app.post('/',(request, res)=>{
    res.sendFile(__dirname + '/client/index.html');
    console.log(request.body.username);
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

const SOCKET_LIST = new Map();


let food = new Food();
io.on('connection', (socket) => {

    let unique = uniqueId();
    socket.player = new Player(unique, unique, 16*3, 16*2, color());
    SOCKET_LIST.set(unique, socket);
    socket.on('disconnect', () => {
        SOCKET_LIST.delete(unique);
    });

    let foodObj = {x: food.x, y: food.y};
    socket.emit('updateFood', foodObj);
    let initObj = {scale: CONSTANTS.gridSize};
    socket.emit('init',  initObj);
    socket.on('keyPress', (data) => {

        const player = socket.player;
        console.log("============");
        console.log(player);
        console.log("============");
        player.pressingRight = false;
        player.pressingLeft = false;
        player.pressingUp = false;
        player.pressingDown = false;
        if (data === CONSTANTS.ARROW_RIGHT) {
            player.pressingRight = true;
        }
        if (data === CONSTANTS.ARROW_LEFT) {
            player.pressingLeft = true;

        }
        if (data === CONSTANTS.ARROW_UP) {
            player.pressingUp = true;
        }
        if (data === CONSTANTS.ARROW_DOWN) {
            player.pressingDown = true;
        }
    });
});

//Set the game tick to 25fps
setInterval(() => {
    let segment = [];
    for (let socket of SOCKET_LIST.values()) {
        let player = socket.player;

        //Player hits border
        if (Environment.hitsBorder(player)) {
            SOCKET_LIST.delete(player.id);
            socket.emit('death', player.score);
            //Player hits food
        }else if(player.snake[0].x === food.x && player.snake[0].y === food.y){
            food.generateRandom();
            console.log(player.id);
            player.bodyLength++;
            player.score++;
            player.hasEaten(true);
            socket.emit('updateFood', {x: food.x, y: food.y, id: player.id});
        }
        player.updatePosition();
        segment.push(player);
    }
    for (let socket of SOCKET_LIST.values()) {
        socket.emit('gameTick', segment);
    }

}, 1000 / 20);