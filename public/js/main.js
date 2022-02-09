

const socket = io.connect();

function enviarProducto() {
    const titulo = document.querySelector('#titulo');
    const precio = document.querySelector('#precio');
    const miniatura = document.querySelector('#miniatura');
    
    socket.emit('productoNuevo', {titulo: titulo.value, precio: precio.value, miniatura: miniatura.value});
    return false;
};

function enviarMensaje(){
    const email = document.querySelector('#email')
    const date = new Date()
    const mensaje = document.querySelector('#mensaje')

    socket.emit('mensajeNuevo', {email: email.value, date: date.value, mensaje: mensaje.value});
    return false

}


socket.on('productos', productos => {
    console.log(productos);
    let html = ``;
    
    if (productos.length > 0) {
        html += `
            <table class="table">
            <thead>
                <tr>
                    <th scope="col">Titulo</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Foto</th>
                </tr>
            </thead>
            <tbody>
                
        `;

        productos.forEach(producto => {
            html += `
                <tr>
                    <td>${producto.titulo}<td>
                    <td>${producto.precio}<td>
                    <td><img src="${producto.miniatura}" alt="" class="img-fluid" style="max-height: 50px;"><td>
                </tr>
            `
        });

        html += `
            
            </tbody>
            </table>
        `
    } else {
        html += `
        <div class="alert alert-info" role="alert">
            No existen productos cargados
        </div>`
    };
    document.getElementById('tabla').innerHTML = html
});

socket.on('mensajes', mensajes => {
    console.log(mensajes);

    let html = ``;

    if (mensajes.length > 0) {
        mensajes.forEach(mensaje => {
            html += `
            <div class="d-flex">
                <p class="text-primary fw-bold me-2">${mensaje.email}</p>
                <p class="text-warning me-2">${mensaje.date}</p>
                <p class="text-success fst-italic">${mensaje.mensaje}</p>
            </div>
            `
        })
    } else {
        html += `
        <div class="alert alert-info" role="alert">
            No existen mensajes
        </div>`
    };

    document.getElementById('mensajes').innerHTML = html
    
});