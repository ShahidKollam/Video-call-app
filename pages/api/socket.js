import { Server } from "socket.io";

const SocketHandler = (req,res) => {
    console.log("called api");
    if (res.socket.server.io) {
        console.log("socket already running");
    } else {
        const io = new Server(res.socket.server) 
        res.socket.server.io = io

        io.on('connection', (socket) => { 
            console.log('server is connected');

            socket?.on('join-room', (roomId, id) => {

                console.log(`a new user ${id} joined romm ${roomId}`);

                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-connected', id)
            })

            socket.on('user-toogle-audio', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toogle-audio', userId)
            })
            
            socket.on('user-toogle-video', (userId, roomId) => {
                socket.join(roomId)
                socket.broadcast.to(roomId).emit('user-toogle-video', userId)
            })
        })
    }       
    res.end() 
}

export default SocketHandler