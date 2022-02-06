let express = require("express")
let app = express()
let httpServer = require("http").createServer(app);
//initializing socket
let io = require("socket.io")(httpServer);




let connections = []; //array of connections


//whenever it is connect, we get socket
io.on("connect", (socket) => {
    connections.push(socket); //adding connections
    console.log(`${socket.id} has connected`);

    //braodcasting to other connections
    socket.on("draw", (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit("ondraw", { x: data.x, y: data.y });
            }
        });
    });

    //other user can also draw in realtime
    socket.on("down", (data) => {
        connections.forEach(con => {
            if (con.id !== socket.id) {
                con.emit("ondown", { x: data.x, y: data.y });
            }
        });
    });

    //When it disconnects
    socket.on("disconnect", (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id !== socket.id);
    });
});

//public folder
app.use(express.static("public"));
let PORT = process.env.PORT || 8080
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));