let canvas = document.getElementById("canvas");

//dimensions
canvas.width = 0.98 * window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");

var io = io.connect("http://localhost:8080/");

let x;
let y;
let mouseDown = false;


//handling mouse pressed events
window.onmousedown = (e) => {
    ctx.moveTo(x, y); // helps to draw from different locations neglected previous drawn location
    io.emit("down", { x, y }); // for other people to draw
    mouseDown = true;
};

window.onmouseup = (e) => {
    mouseDown = false;
};

io.on("ondraw", ({ x, y }) => {
    ctx.lineTo(x, y);
    ctx.stroke();
});

// //other users can draw
io.on("ondown", ({ x, y }) => {
    ctx.moveTo(x, y);
});

//On movement of mouse
window.onmousemove = (e) => {
    x = e.clientX; //x position
    y = e.clientY; //y position

    //can draw only when mouse is down
    if (mouseDown) {
        io.emit("draw", { x, y }); //send drawn data to user's screen
        //draw line through mouse movement
        ctx.lineTo(x, y);
        ctx.stroke();
    }
};