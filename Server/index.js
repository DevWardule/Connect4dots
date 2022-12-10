const express = require('express')
const app = express()
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("disconnecting", () => {
    console.log(socket.rooms.id); // the Set contains at least the socket ID
    });

    socket.on("disconnect", () => {
    // socket.rooms.size === 0
    console.log("Disconnect");
    });

    socket.on("send-move", (data, acknowledgement) => {
        //data contains:
        //1. int move (latest move)
        //2. newCellCheck (latest cellCheck state)
        //3. room (roomId)
        console.log(data);
        socket.to(data.room).emit("receive-move", data);
        const updatedRoom = io.of("/").adapter.rooms.get(data.room)
        console.log(`Room id: ${data.room} ,Size: ${updatedRoom.size}`);
        acknowledgement({
            status: "OK"
        })
    })

    socket.on("create-room", (data, acknowledgement) => {
        console.log(data);
        const room = io.of("/").adapter.rooms.get(data.room)
        if(room === undefined) {
            socket.join(data.room)
            acknowledgement({
                status: "OK"
            })
        }else {
            acknowledgement({
                status: "Room already created"
            })
        }
        // console.log(data.room);
        // socket.join(data.room);
        const updatedRoom = io.of("/").adapter.rooms.get(data.room)
        console.log(`Room id: ${data.room}, Size: ${updatedRoom.size}`);
    })

    socket.on("join-room", (data, acknowledgement) => {
        console.log(data);
        const room = io.of("/").adapter.rooms.get(data.room)
        if(room === undefined) {
            acknowledgement({
                status: "Room not created"
            })
        }else if(room.size === 2){
            acknowledgement({
                status: "Room is full"
            })
        }
        else{
            socket.join(data.room)
            socket.to(data.room).emit("joiner-data", data);
            acknowledgement({
                status: "OK"
            })
        }
        // console.log(data.room);
        // socket.join(data.room);
        const updatedRoom = io.of("/").adapter.rooms.get(data.room)
        console.log(`Room id: ${data.room} ,Size: ${updatedRoom.size}`);
    })

    socket.on("creator-data", (data, acknowledgement) => {
        socket.to(data.room).emit("creator-data", data);
        const updatedRoom = io.of("/").adapter.rooms.get(data.room)
        console.log(`Room id: ${data.room} ,Size: ${updatedRoom.size}`);
        acknowledgement({
            status: "OK"
        })
    })

    socket.on("leave-room", (data, acknowledgement) => {
        // if(room !== undefined){
        //     console.log(`Room id: ${data.room} ,Size: ${room.size}`);
        // }

        socket.leave(data.room);
        const room = io.of("/").adapter.rooms.get(data.room)
        if(room !== undefined){
            console.log(`Room id: ${data.room} ,Size: ${room.size}`);
        }
        
        acknowledgement({
            status: "OK"
        })
        // console.log(data.room);
        // socket.join(data.room);
    })
})

// app.get("/game", (req, res) => {
//     res.json({"users": ["one", "two", "three", "four", "five"]})
// })

server.listen(5000, () => {
    console.log("Server started on port 5000")
})