//Para iniciar servidor
//npm install
//nodemon index.js

/* Modulos */
const express = require('express');
const bp = require('body-parser');
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');

/* const router = express.Router(); */

/* Instancia Express */
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

/* Middlewares */
app.use(express.static('public'));
app.use(express.json());
app.use(bp.urlencoded({ extended: true }));

/* Productos */

const productos = [
    {
        id: 1,
        titulo: 'Producto 1',
        precio: 500,
        miniatura: 'https://cdn3.iconfinder.com/data/icons/geek-3/24/Autobots_transformers_robot_movie-512.png'
    }
];

const mensajes = [

]

/* WebSocket */

io.on('connection', socket => {
    console.log(`Nuevo cliente conectado ${socket.id}`);

    socket.emit('productos', productos);
    socket.emit('mensajes', mensajes);

    socket.on('productoNuevo', producto=>{

        if (productos.length > 0) {
            let ultimo = productos.length - 1
            
            producto['id'] = productos[ultimo].id + 1;
        } else {
            producto['id'] = 1;
        };

        productos.push(producto);
        /* Se actualiza la vista*/
        io.sockets.emit('productos', productos);
    });

    socket.on('mensajeNuevo', mensaje => {
        mensajes.push(mensaje)
        console.log(mensaje);
        io.sockets.emit('mensajes', mensajes);
    })
    

});


/* Rutas */

app.get('/', (req, res) => {
    let existe;
    if (productos.length > 0) {
        existe = true;
    }else{
        existe = false;
    }
    res.status(200).render('inicio', {productos: productos, bandera: existe})
});


app.post('/', (req, res) => {
    let producto = req.body;
    if (productos.length > 0) {
        let ultimo = productos.length - 1
        
        producto['id'] = productos[ultimo].id + 1;
    } else {
        producto['id'] = 1;
    };
    console.log(productos);
    productos.push(producto)
    /* res.status(200).json({
        msj: 'Producto agregado',
        producto,
        productos
    }) */
    let existe;
    if (productos.length > 0) {
        existe = true;
    }else{
        existe = false;
    }
    res.status(200).render('productos', {productos: productos, bandera: existe})
});


/* Servidor */
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
server.on('error', err => {
    console.log('Error', err);
})