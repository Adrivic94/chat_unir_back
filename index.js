const http = require('http');
const express = require('express');
const cors = require('cors');

// Config .env
require('dotenv').config();

console.log('Entre en el server');

// Creación de la app de Express
const app = express();
app.use(cors());

// Creamos el servidor
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

server.on("listening", () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", () => {
  console.log(error.message);
});

// Config socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente');
    // Mando un mensaje a todos los clientes, menos el que se conecta
    socket.broadcast.emit('mensaje_chat', {
        username: 'INFO',
        message: 'Se ha conectado un nuevo usuario'
    });

    // Actualizar el número de clientes conectados
    io.emit('clientes_conectados', io.engine.clientsCount);

    socket.on('mensaje_chat', (data) => {
        //Emitir el mensaje recibido a todos los clientes conectados
        io.emit('mensaje_chat', data);
    })

    socket.on('disconnect', () => { //Para identificar a los usuarios habría que jugar con socket_id
        io.emit('mensaje_chat', {
            username: 'INFO',
            message: 'Se ha desconectado un usuario 👋'
        });
        io.emit('clientes_conectados', io.engine.clientsCount);
    });
});