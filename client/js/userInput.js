export const ARROW_RIGHT = "ArrowRight";
export const ARROW_LEFT = "ArrowLeft";
export const ARROW_UP = "ArrowUp";
export const ARROW_DOWN = "ArrowDown";
let dir;


const direction = (event) => {
    //Only send the key if its not the same.
    if(event.code === dir) return;

    //Dont allow the snake to backtrack. As it would literally kill itself.
    if (event.code === ARROW_RIGHT && dir === ARROW_LEFT) return;
    if (event.code === ARROW_UP && dir === ARROW_DOWN) return;
    if (event.code === ARROW_LEFT && dir === ARROW_RIGHT) return;
    if (event.code === ARROW_DOWN && dir === ARROW_UP) return;


    /*Only track certain keys, as we dont need anything else from you. Yet.*/
    if (event.code === ARROW_RIGHT) {
        socket.emit("keyPress", ARROW_RIGHT);
    }
    if (event.code === ARROW_LEFT) {
        socket.emit("keyPress", ARROW_LEFT);
    }
    if (event.code === ARROW_UP) {
        socket.emit("keyPress", ARROW_UP);
    }
    if (event.code === ARROW_DOWN) {
        socket.emit("keyPress", ARROW_DOWN);
    }
    dir = event.code;
};
document.addEventListener("keydown", direction);
