document.addEventListener('DOMContentLoaded', function () {
    const carrito = [];
    const listaCarrito = document.getElementById('listaCarrito');

    const botones = document.querySelectorAll('.btnAgregar');
    botones.forEach(btn => {
        btn.addEventListener('click', function () {
            const nombre = btn.dataset.nombre;
            const precio = parseFloat(btn.dataset.precio);
            const cantidad = parseInt(btn.previousElementSibling.querySelector('.cantidad').value);

            const index = carrito.findIndex(p => p.nombre === nombre);
            if (index >= 0) {
                carrito[index].cantidad += cantidad;
            } else {
                carrito.push({ nombre, precio, cantidad });
            }

            renderCarrito();
        });
    });

    function renderCarrito() {
        listaCarrito.innerHTML = "";
        let totalSinDesc = 0;
        let totalFinal = 0;

        let cantPulsera = 0, cantCollar = 0, cantAnillo = 0;
        carrito.forEach(p => {
            if (p.nombre === "Pulsera") cantPulsera = p.cantidad;
            if (p.nombre === "Collar") cantCollar = p.cantidad;
            if (p.nombre === "Anillo") cantAnillo = p.cantidad;
        });

        const gruposPulseraCollar = Math.min(cantPulsera, cantCollar);

        carrito.forEach((p, index) => {
            let subtotal = p.precio * p.cantidad;
            let descuento = 0;

            if ((p.nombre === "Pulsera" || p.nombre === "Collar") && gruposPulseraCollar > 0) {
                const pCount = p.nombre === "Pulsera" ? cantPulsera : cantCollar;
                const otrosCount = p.nombre === "Pulsera" ? cantCollar : cantPulsera;

                const gruposAplicables = Math.min(gruposPulseraCollar, pCount);
                const subtotalPromo = gruposAplicables * (299999 / 2); 
                const subtotalNormal = (p.cantidad - gruposAplicables) * p.precio;
                subtotal = subtotalPromo + subtotalNormal;

                descuento += gruposAplicables * p.precio + gruposAplicables * carrito.find(c => c.nombre !== p.nombre && (c.nombre === "Pulsera" || c.nombre === "Collar")).precio - gruposAplicables * 299999;
            }

            if (p.nombre == "Pulsera" ) {
                const grupos = Math.floor(p.cantidad / 3);
                if (grupos >= 1) {
                    descuento += grupos * p.precio;
                    subtotal -= grupos * p.precio;
                }
            }

            if (p.nombre === "Anillo" && cantAnillo >= 3) {
                const extra = subtotal * 0.10;
                subtotal -= extra;
                descuento += extra;
            }

            totalSinDesc += p.precio * p.cantidad;
            totalFinal += subtotal;

            const div = document.createElement('div');
            div.innerHTML = `
                ${p.nombre} × ${p.cantidad} = $${subtotal.toLocaleString()} 
                <button class="btnEliminar" data-index="${index}">X</button>
            `;
            listaCarrito.appendChild(div);

            div.querySelector('.btnEliminar').addEventListener('click', (e) => {
                const i = e.target.dataset.index;
                carrito.splice(i, 1);
                renderCarrito();
            });
        });

        document.getElementById('totalSinDesc').textContent = totalSinDesc.toLocaleString();
        document.getElementById('descuento').textContent = (totalSinDesc - totalFinal).toLocaleString();
        document.getElementById('totalFinal').textContent = totalFinal.toLocaleString();
    }
});

  