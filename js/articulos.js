// URL base de la API
const API_URL = "http://localhost:8080/api/articulos";
const API_URL_CAT = "http://localhost:8080/api/categorias";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarArticulos);

// Manejador del formulario
document.getElementById("form-articulo").addEventListener("submit", guardarArticulo);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    // Limpiar todos los campos del formulario
    document.getElementById("form-articulo").reset();
    // Borrar el ID oculto del formulario
    document.getElementById("idArticulo").value = "";
    // ya sea que guardo o actualizo, seteo todo para que quede Guardar listo
    document.getElementById("accion").textContent = "Guardar",
    document.getElementById("accion").classList.remove('btn-success'),
    document.getElementById("accion").classList.add('btn-primary')
});

// === Listar todos los artículos ===
function listarArticulos() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(API_URL)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-articulos"); // Obtenemos el cuerpo de la tabla
            tbody.innerHTML = ""; // Limpiar tabla antes de insertar nuevos datos
            data.forEach(articulo => {
                const fila = document.createElement("tr"); // Creamos una fila de tabla
                // Insertamos columnas con los datos del artículo y botones de acción
                fila.innerHTML = `
                    <td>${articulo.id}</td>
                    <td>${articulo.nombre}</td>
                    <td>${articulo.categoria.descripcion}</td>
                    <td>${articulo.precio.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarArticulo(${articulo.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// === Guardar o actualizar un artículo ===
function guardarArticulo(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const idForm = document.getElementById("idArticulo").value;
    const nombreForm = document.getElementById("nombre").value.trim();
    const categoriaForm = document.getElementById("categorias").value;
    const precioForm = parseFloat(document.getElementById("precio").value);

    // Validación de campos
    if (!nombreForm || isNaN(precioForm) || precioForm < 0) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    // Creamos un objeto artículo con los datos del formulario sin JSON.stringgify para construir con id de categoria relacionada
    //const articulo = '{"nombre": "'+nombreForm+'",  "precio": '+precioForm+',  "categoria":  { "id": '+categoriaForm+'}  }';

    const guardarArticulo = {
        nombre: nombreForm,
        precio: precioForm,
        categoria: { 
            id: categoriaForm
        }
    };

    const articulo = JSON.stringify(guardarArticulo);

    // Determinamos si es una edición (PUT) o creación (POST)
    const url = idForm ? `${API_URL}/${idForm}` : API_URL;
    const metodo = idForm ? "PUT" : "POST";

    // Enviamos el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" }, // Indicamos que el cuerpo es JSON
        //body: JSON.stringify(articulo) // Convertimos el objeto a JSON
        body: articulo
    })
    .then(response => {
//console.log(articulo); // chequeo objeto
        if (!response.ok) throw new Error("Error al guardar"); // Verificamos respuesta exitosa
        return response.json();
    })
    .then(() => {
        // Limpiamos el formulario y recargamos la tabla
        document.getElementById("form-articulo").reset();
        document.getElementById("idArticulo").value = "";
        listarArticulos();
    })
    .then( // ya sea que guardo o actualizo, seteo todo para que quede Guardar listo
        document.getElementById("accion").textContent = "Guardar",
        document.getElementById("accion").classList.remove('btn-success'),
        document.getElementById("accion").classList.add('btn-primary')
    )    
    .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}

// === Cargar artículo en el formulario para edición ===
function editarArticulo(idForm) {
    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/${idForm}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(articulo => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idArticulo").value = articulo.id;
            document.getElementById("nombre").value = articulo.nombre;
            //document.getElementById("categorias").value = articulo.categoria.descripcion; /// modificado por usar <option>
            const selectElement = document.getElementById('categorias');
            selectElement.value = articulo.categoria.id; 
            //  console.log("desc: "+articulo.categoria.descripcion);
            document.getElementById("precio").value = articulo.precio;
        })
        .then( // modifico texto de botón para que no sea guardar, sino Actualizar
            document.getElementById("accion").textContent = "Actualizar",
            document.getElementById("accion").classList.remove('btn-primary'),
            document.getElementById("accion").classList.add('btn-success')
        )
        .catch(error => console.error("Error al obtener artículo:", error)); // Manejo de errores
}

// === Eliminar un artículo ===
function eliminarArticulo(idForm) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este artículo?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/${idForm}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
            listarArticulos(); // Actualizamos la lista de artículos
        })
        .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}
