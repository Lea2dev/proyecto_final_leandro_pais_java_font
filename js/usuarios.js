// URL base de la API
const API_URL = "http://localhost:8080/api/usuarios";

// Cuando se carga la página, mostramos el listado
document.addEventListener("DOMContentLoaded", listarUsuarios);

// Manejador del formulario
document.getElementById("form-usuario").addEventListener("submit", guardarUsuario);

// Botón para cancelar edición
document.getElementById("cancelar").addEventListener("click", () => {
    // Limpiar todos los campos del formulario
    document.getElementById("form-usuario").reset();
    // Borrar el ID oculto del formulario
    document.getElementById("idUsuario").value = "";
});

// === Listar todos los artículos ===
function listarUsuarios() {
    // Llamada GET a la API para obtener todos los artículos
    fetch(API_URL)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(data => {
            const tbody = document.getElementById("tabla-usuarios"); // Obtenemos el cuerpo de la tabla
            tbody.innerHTML = ""; // Limpiar tabla antes de insertar nuevos datos
            data.forEach(usuario => {
                const fila = document.createElement("tr"); // Creamos una fila de tabla
                // Insertamos columnas con los datos del artículo y botones de acción
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.userName}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(fila); // Agregamos la fila al cuerpo de la tabla
            });
        })
        .catch(error => console.error("Error al listar artículos:", error)); // Manejo de errores
}

// === Guardar o actualizar un artículo ===
function guardarUsuario(event) {
    event.preventDefault(); // Evitamos el comportamiento por defecto del formulario

    // Obtenemos los valores de los campos del formulario
    const id = document.getElementById("idUsuario").value;
    const userName = document.getElementById("nombre").value.trim();
    const pass = document.getElementById("pass").value;

    // Validación de campos
    if (!userName || pass.length < 3) {
        alert("Por favor complete correctamente los campos.");
        return;
    } 

    // Creamos un objeto artículo con los datos del formulario
    const usuario = { userName, pass };

    // Determinamos si es una edición (PUT) o creación (POST)
    const url = id ? `${API_URL}/${id}` : API_URL;
    const metodo = id ? "PUT" : "POST";

    // Enviamos el artículo al backend usando fetch
    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" }, // Indicamos que el cuerpo es JSON
        body: JSON.stringify(usuario) // Convertimos el objeto a JSON
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar"); // Verificamos respuesta exitosa
        return response.json();
    })
    .then(() => {
        // Limpiamos el formulario y recargamos la tabla
        document.getElementById("form-usuario").reset();
        document.getElementById("idUsuario").value = "";
        listarUsuarios();
    })
    .catch(error => console.error("Error al guardar artículo:", error)); // Manejo de errores
}

// === Cargar artículo en el formulario para edición ===
function editarUsuario(id) {
    
    

    // Llamada GET para obtener los datos del artículo por su ID
    fetch(`${API_URL}/${id}`)
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(usuario => {
            // Cargamos los datos del artículo en el formulario
            document.getElementById("idUsuario").value = usuario.id;
            document.getElementById("nombre").value = usuario.userName;
            document.getElementById("pass").value = usuario.pass;
        })
        .catch(error => console.error("Error al obtener usuario:", error)); // Manejo de errores
}

// === Eliminar un artículo ===
function eliminarUsuario(id) {
    // Confirmación antes de eliminar
    if (confirm("¿Deseás eliminar este usuario?")) {
        // Llamada DELETE al backend
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) throw new Error("Error al eliminar"); // Verificamos que la respuesta sea exitosa
            listarUsuarios(); // Actualizamos la lista de artículos
        })
        .catch(error => console.error("Error al eliminar artículo:", error)); // Manejo de errores
    }
}
