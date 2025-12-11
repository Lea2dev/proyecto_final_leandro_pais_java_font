// URL base de la API
const API_URL = "http://localhost:8080/api/categorias";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarCategorias);

// Manejador del formulario
document.getElementById("form-categoria").addEventListener("submit", guardarCategoria);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    // Limpiar todos los campos del formulario
    document.getElementById("form-categoria").reset();
    // Borrar el ID oculto del formulario
    document.getElementById("idCategoria").value = "";
});

// === Listar todos los artículos ===
function listarCategorias() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(API_URL)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-categorias"); // Obtenemos el cuerpo de la tabla
            tbody.innerHTML = ""; // Limpiar tabla antes de insertar nuevos datos
            data.forEach(categoria => {
                const fila = document.createElement("tr"); // Creamos una fila de tabla
                // Insertamos columnas con los datos del artículo y botones de acción
                fila.innerHTML = `
                    <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCategoria(${categoria.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// === Guardar o actualizar un artículo ===
function guardarCategoria(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const id = document.getElementById("idCategoria").value;
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value;

    // Validación de campos
    if (!nombre || descripcion.length < 3) {
        alert("Por favor complete correctamente los campos.");
        return;
    }

    // Creamos un objeto artículo con los datos del formulario
    const categoria = { nombre, descripcion };
    // Determinamos si es una edición (PUT) o creación (POST)
    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? "PUT" : "POST";

    // Enviamos el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" }, // Indicamos que el cuerpo es JSON
        body: JSON.stringify(categoria) // Convertimos el objeto a JSON
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar"); // Verificamos respuesta exitosa
        return response.json();
    })
    .then(() => {
        // Limpiamos el formulario y recargamos la tabla
        document.getElementById("form-categoria").reset();
        document.getElementById("idCategoria").value = "";
        listarCategorias();
    })
    .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}

// === Cargar artículo en el formulario para edición ===
function editarCategoria(id) {
    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/${id}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(categoria => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idCategoria").value = categoria.id;
            document.getElementById("nombre").value = categoria.nombre;
            document.getElementById("descripcion").value = categoria.descripcion;
        })
        .catch(error => console.error("Error al obtener artículo:", error)); // Manejo de errores
}

// === Eliminar un artículo ===
function eliminarCategoria(id) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este artículo?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
            listarCategorias(); // Actualizamos la lista de artículos
        })
        .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}
