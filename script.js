const productos = [
  // 🍕 PIZZAS
  {
    id: 1,
    tipo: "pizza",
    nombre: "Pizza Napolitana",
    ingredientes: "Queso mozzarella, tomate, albahaca",
    precio: 55000,
    imagen: "img/napolitana.jpg"
  },
  {
    id: 2,
    tipo: "pizza",
    nombre: "Pizza Vegetariana",
    ingredientes: "Queso, champiñones, pimentón, cebolla",
    precio: 62000,
    imagen: "img/vegetaiana.jpg"
  },
  {
    id: 3,
    tipo: "pizza",
    nombre: "Pizza Mixta de Carnes",
    ingredientes: "Pepperoni, jamón, carne molida, salchicha, tocino",
    precio: 75000,
    imagen: "img/mixta de carnes.jpg"
  },
  {
    id: 4,
    tipo: "pizza",
    nombre: "Pizza de la Casa",
    ingredientes: "Pimentón, champiñones, cebolla, aceitunas, tomate cherry, albahaca bañada en aceite balsámico",
    precio: 68000,
    imagen: "img/de la casa.jpg"
  },
  {
    id: 5,
    tipo: "pizza",
    nombre: "Pizza Pepperoni",
    ingredientes: "Pepperoni, queso mozzarella",
    precio: 55000,
    imagen: "img/pepperoni.jpg"
  },

  // 🥤 BEBIDAS
  {
    id: 6,
    tipo: "bebida",
    nombre: "Coca-Cola",
    precio: 12000, 
    imagen: "img/cocacola.jpg"
  },
  {
    id: 8,
    tipo: "bebida",
    nombre: "Postobon Colombiana",
    precio: 10000, 
    imagen: "img/postobon.webp"
  },
  {
    id: 9,
    tipo: "bebida",
    nombre: "Agua",
    precio: 3000,
    tamaño: "500ml", 
    imagen: "img/agua.webp"
  },
  {
    id: 10,
    tipo: "bebida",
    nombre: "Jugo Hit",
    precio: 8000,
    tamaño: "1.5L", 
    imagen: "img/jugoHit.webp"
  }
];

let carrito = [];

// --- Configuración de elementos HTML ---
const listaPizzas = document.getElementById("lista-pizzas");
const listaBebidas = document.getElementById("lista-bebidas");
const btnCarrito = document.getElementById("btn-carrito");
const btnMenu = document.getElementById("btn-menu");
const productosSection = document.getElementById("productos");
const carritoSection = document.getElementById("carrito");
const pagoSection = document.getElementById("pago");

// Elementos del Modal
const modalCarrito = document.getElementById("modal-carrito");
const cerrarModalBtn = document.getElementById("cerrar-modal");
const listaModal = document.getElementById("lista-modal");
const totalModalEl = document.getElementById("total-modal");

// Elementos de la notificación
const notificacionEl = document.getElementById("notificacion");
const contadorCarrito = document.getElementById("contador-carrito");
const btnConfirmarModal = document.getElementById("btn-confirmar-modal");

//  Precios base según tamaño //
const PRECIOS_PIZZA = {
    "familiar": 0, 
    "grande": -10000,
    "mediana": -20000,
    "pequeña": -30000
};

const PRECIOS_BEBIDA = {
    "350ml": -5000,
    "1.5L": 0, 
    "2.5L": 5000
};

// Función principal para mostrar productos en el DOM
function mostrarProductos() {
    listaPizzas.innerHTML = "";
    listaBebidas.innerHTML = "";

    productos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        const precioBase = p.precio;

        let contenido = `
            <img src="${p.imagen}" alt="${p.nombre}">
            <h3>${p.nombre}</h3>
        `;

        // (Pizzas y bebidas seleccionadas)
        const necesitaSelector = p.tipo === "pizza" || p.id === 6 || p.id === 8;
        let opcionesHTML = '';
        let tamanoPorDefecto = '';

        if (p.tipo === "pizza") {
            opcionesHTML = `
                <option value="pequeña">Pequeña</option>
                <option value="mediana">Mediana</option>
                <option value="grande">Grande</option>
                <option value="familiar" selected>Familiar</option>
            `;
            tamanoPorDefecto = 'familiar';
            contenido += `<p><strong>Ingredientes:</strong> ${p.ingredientes}</p>`;
        } else if (p.id === 6 || p.id === 8) { 
            opcionesHTML = `
                <option value="350ml">350ml</option>
                <option value="1.5L" selected>1.5L</option>
                <option value="2.5L">2.5L</option>
            `;
            tamanoPorDefecto = '1.5L';
        }

        if (necesitaSelector) {
            contenido += `
                <label for="tamano-${p.id}"><strong>Tamaño:</strong></label>
                <select id="tamano-${p.id}" class="select-tamano">
                    ${opcionesHTML}
                </select>
            `;
        } else {
            contenido += `<p><strong>Tamaño:</strong> ${p.tamaño || 'N/A'}</p>`;
        }
        
        // Precio base inicial
        contenido += `
            <p id="precio-${p.id}"><strong>Precio:</strong> $${precioBase.toLocaleString('es-CO')}</p>
            <button class="btn-agregar" onclick="agregarCarrito(${p.id})">Añadir al carrito</button>
        `;

        card.innerHTML = contenido;

        // Añadir a la sección correcta del DOM
        if (p.tipo === "pizza") listaPizzas.appendChild(card);
        else listaBebidas.appendChild(card);

        // Manejar cambios en el selector de tamaño
        if (necesitaSelector) {
            const selectTamano = card.querySelector(`#tamano-${p.id}`);
            const textoPrecio = card.querySelector(`#precio-${p.id}`);
            
            // Inicializar con el precio base
            p.precioSeleccionado = precioBase;
            p.tamañoSeleccionado = tamanoPorDefecto;

            selectTamano.addEventListener("change", () => {
                let nuevoPrecio = precioBase;
                const valorSeleccionado = selectTamano.value;
                
                if (p.tipo === "pizza") {
                    nuevoPrecio += PRECIOS_PIZZA[valorSeleccionado] || 0;
                } else if (p.id === 6 || p.id === 8) {
                    nuevoPrecio += PRECIOS_BEBIDA[valorSeleccionado] || 0;
                }

                textoPrecio.innerHTML = `<strong>Precio:</strong> $${nuevoPrecio.toLocaleString('es-CO')}`;
                 
                p.precioSeleccionado = nuevoPrecio;
                p.tamañoSeleccionado = valorSeleccionado;
            });
        } else {
            
            p.precioSeleccionado = p.precio;
            p.tamañoSeleccionado = p.tamaño;
        }
    });
}

// Agregar al carrito
function agregarCarrito(id) {
    const productoBase = productos.find(p => p.id === id);
    if (!productoBase) return;

   
    let precio = productoBase.precio;
    let tamano = productoBase.tamaño || 'N/A';
    
 
    const selectEl = document.getElementById(`tamano-${id}`);
    if (selectEl) {
        tamano = selectEl.value;
        // Recalcular el precio para asegurarnos que sea correcto
        if (productoBase.tipo === "pizza") {
            precio += PRECIOS_PIZZA[tamano] || 0;
        } else if (productoBase.id === 6 || productoBase.id === 8) {
            precio += PRECIOS_BEBIDA[tamano] || 0;
        }
    } else {
        
        precio = productoBase.precio;
    }

    
    const itemCarrito = {
        ...productoBase,
        
        carritoId: Date.now() + Math.random(), 
        precioSeleccionado: precio,
        tamañoSeleccionado: tamano
    };

    carrito.push(itemCarrito);

    mostrarNotificacion("✅ Producto añadido al carrito");
    actualizarCarrito();
}

// Mostrar notificación
function mostrarNotificacion(mensaje) {
    notificacionEl.textContent = mensaje;
    notificacionEl.classList.remove('oculto');
    notificacionEl.classList.add('mostrar'); 
    setTimeout(() => {
        notificacionEl.classList.remove('mostrar');
        // Usar un pequeño retraso para permitir la transición CSS
        setTimeout(() => notificacionEl.classList.add('oculto'), 500);
    }, 1500);
}

// Mostrar productos en el carrito (MODAL)
function actualizarCarrito() {
    listaModal.innerHTML = "";
    let total = 0;

    carrito.forEach((item, index) => {
        const precioUnitario = item.precioSeleccionado;
        total += precioUnitario;
        
        const li = document.createElement("li");
       //precio y tamaño seleccionado
        li.innerHTML = `
            ${item.nombre} (${item.tamañoSeleccionado}) - <strong>$${precioUnitario.toLocaleString('es-CO')}</strong>
            <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
        `;
        listaModal.appendChild(li);
    });

    totalModalEl.textContent = `$${total.toLocaleString('es-CO')}`;
    contadorCarrito.textContent = carrito.length;
}

// Eliminar un producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

// Mostrar el modal del carrito
function mostrarVentanaCarrito() {
    modalCarrito.classList.remove("oculto");
    // Ocultar otras secciones si están visibles
    productosSection.classList.add("oculto");
    carritoSection.classList.add("oculto");
    pagoSection.classList.add("oculto");
    actualizarCarrito();
}

// Cerrar el modal del carrito
function cerrarCarrito() {
    modalCarrito.classList.add("oculto");
    productosSection.classList.remove("oculto");
}


btnCarrito.addEventListener("click", mostrarVentanaCarrito);
cerrarModalBtn.addEventListener("click", cerrarCarrito);

// Cerrar el modal al hacer clic fuera del contenido
modalCarrito.addEventListener('click', (e) => {
    if (e.target === modalCarrito) {
        cerrarCarrito();
    }
});

// Cambiar a la sección de productos (Menú)
btnMenu.addEventListener("click", () => {
    productosSection.classList.remove("oculto");
    carritoSection.classList.add("oculto");
    pagoSection.classList.add("oculto");
    cerrarCarrito(); 
});

// Confirmar compra desde el modal del carrito
btnConfirmarModal.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregue productos para continuar.");
        return;
    }
    cerrarCarrito();
    productosSection.classList.add("oculto");
    pagoSection.classList.remove("oculto");
});

// Inicialización
mostrarProductos();
actualizarCarrito();

// --- Nuevos elementos HTML ---
const btnConfirmarPago = document.getElementById("btn-confirmar"); // El botón Confirmar Pago
const metodosPagoContainer = document.querySelector(".metodos-pago-grid"); // Contenedor de métodos de pago



function inicializarSeccionPago() {
 
    btnConfirmarPago.disabled = true;
    btnConfirmarPago.textContent = "Selecciona un método";
    btnConfirmarPago.style.opacity = '0.7';

    
    if (metodosPagoContainer) {
        metodosPagoContainer.addEventListener('change', (e) => {
            if (e.target.name === 'metodo') {
       
                btnConfirmarPago.disabled = false;
                btnConfirmarPago.textContent = `Confirmar Pago con ${e.target.value}`;
                btnConfirmarPago.style.opacity = '1';
            }
        });
    }

    // 3. Escuchar el clic del botón de confirmación
    btnConfirmarPago.addEventListener('click', finalizarCompra);
}

// 4. Función de Simulación de Finalización de Compra
function finalizarCompra() {
    // Obtenemos el método de pago seleccionado
    const metodoSeleccionado = document.querySelector('input[name="metodo"]:checked').value;
    const totalFinal = document.getElementById("total-modal").textContent; // Obtenemos el total del modal

    // Simulación de procesamiento de pago
    alert(`🎉 ¡Pedido Confirmado! 🎉
    
    Total a pagar: ${totalFinal}
    Método seleccionado: ${metodoSeleccionado}
    
    Gracias por tu compra en Pizzería La Ceja.`);

    // Lógica de reseteo:
    carrito = []; // Vaciar el carrito
    actualizarCarrito(); // Refrescar el contador y el modal

    // Redireccionar al menú principal o a una página de éxito
    document.getElementById("pago").classList.add("oculto");
    document.getElementById("productos").classList.remove("oculto");

    // Resetear el botón de pago
    btnConfirmarPago.disabled = true;
    btnConfirmarPago.textContent = "Selecciona un método";
    btnConfirmarPago.style.opacity = '0.7';
}


inicializarSeccionPago();