const express = require('express')
const { Server: IOServer } = require('socket.io')
const puerto = 8080;
const path = require('path')
const app = express()
const Container = require('./ContainerChat.js');
chats = new Container;
const ContainerProducts = require('./ContainerProducts.js');
saveProducts = new ContainerProducts;
const serverExpress = app.listen(puerto, () => {
    try{
        console.log(`El servidor está escuchando el puerto: ${puerto}`)
    }
    catch(error){
        console.log("Ocurrió el siguiente error al iniciar: ", error);
    }
});
const io = new IOServer(serverExpress)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const messagesArray = []
const products = []

app.use(express.static(path.join(__dirname, '../public')));

io.on('connection', socket => {
    console.log('Se conectó el cliente con id: ', socket.id);
    socket.emit('server:messeges', messagesArray);
    socket.on('client:message', msgInfo => {
        messagesArray.push(msgInfo);
        chats.save(msgInfo);
        io.emit('server:messeges', messagesArray)
        console.log(`el cliente ${socket.id} envió un mensaje`)
    })
    socket.emit('server:products', products);
    socket.on('client:product', productoInfo => {
        products.push(productoInfo);
        saveProducts.save(productoInfo)
        io.emit('server:products', products);
    })
})