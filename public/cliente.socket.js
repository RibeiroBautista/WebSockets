//Messeges FORM
const socket = io()
const messagesPool = document.querySelector('#messagesPool')
const messagesForm = document.querySelector('#messagesForm')
const emailInput = document.querySelector('#emailInput')
const messageInput = document.querySelector('#messageInput')
//
//Products FORM
const productForm = document.querySelector('#productForm');
const urlInput = document.querySelector('#urlInput');
const priceInput = document.querySelector('#priceInput');
const descriptionInput = document.querySelector('#descriptionInput');
//
//Functions PRODUCTS
function sendProduct (productInfo) {

    socket.emit('client:product', productInfo)

};
async function renderProducts (productos) {

    const response = await fetch('/partials/listProducts.ejs');
    const pagina = await response.text();
    document.querySelector('#products').innerHTML = "";
    productos.forEach(product => {
    
        const html = ejs.render(pagina, product);
        document.querySelector('#products').innerHTML += html;
    
    });

}
function submitHandlerProduct (event) {

    event.preventDefault();
    const productoInfo = { thumbnail: urlInput.value, price: priceInput.value, description: descriptionInput.value };
    sendProduct(productoInfo);

};
//
//Functions MESSEGES
function sendMessage(messageInfo) {

    socket.emit('client:message', messageInfo)

}
function renderMesseges (messageInfo) {

    const html = messageInfo.map(msgInfo => {
        return(`
        <div>
            <strong style='color:blue;'>${msgInfo.username}</strong>:
            <span style='color: brown;'>[ ${msgInfo.time} ]: </span>
            <em>${msgInfo.message}</em>
        </div>`)
    }).join(" ");
    messagesPool.innerHTML = html;

}
function submitHandlerMessage (event) {

    const date = dayjs().set().format('DD-MM-YYYY HH:mm:ss');
    event.preventDefault()
    const messageInfo = { username: emailInput.value, time: date, message: messageInput.value }
    sendMessage(messageInfo)

}
//
//EventListenerSubmit PRODUCTS
productForm.addEventListener('submit', submitHandlerProduct)
socket.on('server:products', renderProducts);
//
//EventListenerSubmit MESSEGES
messagesForm.addEventListener('submit', submitHandlerMessage)
socket.on('server:messeges', renderMesseges)
//
