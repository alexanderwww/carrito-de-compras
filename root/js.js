const containerCards=document.getElementById('cards')
const containerItems=document.getElementById('items')
const containerFooter=document.getElementById('footer')

const template=document.getElementById('template-card').content
const templateCarrito=document.getElementById('template-carrito').content
const templateFooter=document.getElementById('template-footer').content

let frament=document.createDocumentFragment()

let carrito={}

document.addEventListener('DOMContentLoaded',()=>{
    // console.log('Esperar a que carge el html')
    llamarApi()
    if(localStorage.getItem('llaveInventada')){
        carrito=JSON.parse(localStorage.getItem('llaveInventada'))
        pintarCarrito()
    }
})

containerItems.addEventListener('click',e=>{
    btnAccion(e)
})

// Al darle click a algun lugar y ver si es el btn
containerCards.addEventListener('click',e=>{
    agregarAlCarrito(e)
})

let llamarApi=async()=>{
    try {
        const respuesta= await fetch('root/api.json')
        const datos= await respuesta.json()
        pintarCajas(datos)
    } catch (error) {
        console.log(error)
    }
}

const pintarCajas=dato=>{
    // console.log(dato)
    dato.forEach(element => {
        clone=template.cloneNode(true)
        clone.querySelector('h5').textContent=element.title
        clone.querySelector('p').textContent=element.precio
        clone.querySelector('img').src=element.thumbnailUrl
        // clone.querySelector('button').setAttribute('data-id',element.id)
        clone.querySelector('button').dataset.id=element.id



        frament.appendChild(clone)
        // template.querySelector('h5').textContent=element.precio
        // console.log(element.title)
    });
    containerCards.appendChild(frament)
}

const agregarAlCarrito=e=>{
    // console.log(e.target.classList.contains('btn-dark'))

    if(e.target.classList.contains('btn-dark')){
        // console.log('Click en un btn')
        // console.log(e.target.parentElement)
        // parentNode es el padre del nodo actua
        // console.log(e.target.parentNode)
        setCarrito(e.target.parentNode)

    }
    e.stopPropagation()
}

const setCarrito=div=>{
    // console.log(div.querySelector('button').dataset.id)
    // console.log(div)
    let producto={
        id:div.querySelector('button').dataset.id,
        titulo:div.querySelector('h5').textContent,
        precio:div.querySelector('p').textContent,
        cantidad:1
    }
    // console.log(carrito.hasOwnProperty(producto.id))
    if(carrito.hasOwnProperty(producto.id)){
        // sumo la cantidad del producto mas 1 producto mas 
        producto.cantidad+=carrito[producto.id].cantidad
    }

    // le agragar un objeto(que es el id del producto) al array de objetos Carrito,
    // lo que hace los 3 ... es agregar toda la colecion de objetos, del array de objetos Productos
    //enves de estar agregando uno por uno 
    carrito[producto.id]={...producto}
    pintarCarrito()
    // console.log(producto)


}

const pintarCarrito=()=>{

    containerItems.innerHTML=''

    Object.values(carrito).forEach(producto=>{
        // console.log(producto)
        
        clonCarrito=templateCarrito.cloneNode(true)
        clonCarrito.querySelector('th').textContent=producto.id
        clonCarrito.querySelectorAll('td')[0].textContent=producto.titulo
        clonCarrito.querySelectorAll('td')[1].textContent=producto.cantidad
        clonCarrito.querySelector('span').textContent=producto.precio * producto.cantidad


        frament.appendChild(clonCarrito)

    })

    containerItems.appendChild(frament)

    pintarFooter()

    localStorage.setItem('llaveInventada',JSON.stringify(carrito))
}

const pintarFooter=()=>{
    
    containerFooter.innerHTML=''

    // SI EL CARRITO NO TIENE NINGU PRODUCTO 
    if(Object.keys(carrito).length===0){
        // EL return PERMITE QUE NO SE LEA EL CODIGO DE ABAJO PORQUE ES INNECESARIO 
        return containerFooter.innerHTML=`<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
    }

    // el valorInicial es 0
    // ,Lo que hace reduce es sumar todos los num dentro del array, para eso
    // converir la lista de objetos en un array con esto acedo a la cantidad {}
    const nCantidad=Object.values(carrito).reduce((valorInicial,{cantidad})=>{
        return valorInicial+cantidad
    },0)
    const nPrecio=Object.values(carrito).reduce((valorInicial,{cantidad,precio})=>{
        return valorInicial+cantidad*precio
    },0)

    let clonFooter=templateFooter.cloneNode(true)
    clonFooter.querySelectorAll('td')[0].textContent=nCantidad
    clonFooter.querySelector('span').textContent=nPrecio

    frament.appendChild(clonFooter)
    containerFooter.appendChild(frament)

    // ASI VACIAMOS EL CARRITO  

    const vaciarCarrito=document.getElementById('vaciar-carrito')
    vaciarCarrito.addEventListener('click',()=>{
        carrito={}
        pintarCarrito()
    })


}

const btnAccion=e=>{
    // console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        // console.log(e.target.parentNode.parentNode)
        const idProducto=e.target.parentNode.parentNode.querySelector('th').textContent
        
        carrito[idProducto].cantidad++

    }

    if(e.target.classList.contains('btn-danger')){
        // console.log(e.target.parentNode.parentNode)
        const idProducto=e.target.parentNode.parentNode.querySelector('th').textContent
        
        carrito[idProducto].cantidad--

        if(carrito[idProducto].cantidad === 0){
            delete carrito[idProducto]
        }

    }

    pintarCarrito()

}


// ------------------------------Funcion reduce 

// let lista=[
//     {id:7,cantidad1:10},
//     {id:6,cantidad1:20},
//     {id:5,cantidad1:50},
//     {id:15,cantidad1:300}
// ]

// let lista2=lista.reduce((valor1,{cantidad1})=>{
//     return valor1 + cantidad1
// },0)

// console.log(lista2)

// ------------------------------Funcion suma de string 
// let lista=[
//         // 7 por 10 es 70
//         {id:"7",cantidad1:10},
//         // esto da 0
//         {id:"0",cantidad1:10},
//         {id:"0",cantidad1:10},
//         {id:"0",cantidad1:10},
//         // 2 por 10 es 20 
//         {id:"2",cantidad1:10}
//         // 20 mas 70 es 90

//     ].reduce((valorInicial,{id,cantidad1})=>{
//         return valorInicial+cantidad1*id
//     },0)

// console.log(lista)