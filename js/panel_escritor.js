// =======================
// Ejecutar al cargar la página
// =======================
document.addEventListener('DOMContentLoaded', () => {
    actualizarNav();
    cargarNoticias();
    verificarAutorizacionCalendario();
    cargarEventos();
});

// =======================
// Publicar una noticia
// =======================
function publicarNoticia() {
    const titulo = document.getElementById('tituloNoticia').value.trim();
    const editor = document.getElementById('editor');
    const contenido = editor.innerHTML.trim();
    const inputImagen = document.getElementById('imagenNoticia');
    const usuarioActual = localStorage.getItem('usuario');

    if (!titulo || !contenido) {
        alert("Debe completar título y contenido.");
        return;
    }

    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    const guardar = (imagen) => {
        noticias.push({
            titulo,
            contenido,
            imagen: imagen || '',
            fecha: new Date().toLocaleString(),
            autor: usuarioActual
        });
        localStorage.setItem('noticias', JSON.stringify(noticias));

        // Vaciar campos
        document.getElementById('tituloNoticia').value = '';
        editor.innerHTML = '';
        inputImagen.value = '';

        cargarNoticias();
        alert("Noticia publicada correctamente!");
    };

    if (inputImagen.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => guardar(e.target.result);
        reader.readAsDataURL(inputImagen.files[0]);
    } else {
        guardar('');
    }
}

// =======================
// Cargar noticias del escritor actual
// =======================
function cargarNoticias() {
    const cont = document.getElementById('noticiasContainer');
    cont.innerHTML = '';
    const usuarioActual = localStorage.getItem('usuario');
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    const noticiasUsuario = noticias
        .map((n, i) => ({ ...n, indexGlobal: i }))
        .filter(n => n.autor === usuarioActual);

    if (noticiasUsuario.length === 0) {
        cont.innerHTML = '<p>No hay noticias publicadas.</p>';
        return;
    }

    noticiasUsuario.forEach(n => {
        const div = document.createElement('div');
        div.className = 'noticia-mini';
        div.innerHTML = `
            ${n.imagen ? `<img src="${n.imagen}" alt="${n.titulo}">` : ''}
            <h3>${n.titulo}</h3>
            <p>${n.contenido.substring(0, 100)}...</p>
        `;

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = (e) => {
            e.stopPropagation();
            eliminarNoticia(n.indexGlobal);
        };
        div.appendChild(btnEliminar);

        // Click para ver noticia completa
        div.addEventListener('click', () => {
            localStorage.setItem('noticiaActual', n.indexGlobal);
            window.location.href = 'ver_noticia.html';
        });

        cont.appendChild(div);
    });
}

// =======================
// Eliminar noticia
// =======================
function eliminarNoticia(indexGlobal) {
    if (!confirm("¿Desea eliminar esta noticia?")) return;
    let noticias = JSON.parse(localStorage.getItem('noticias') || '[]');
    noticias.splice(indexGlobal, 1);
    localStorage.setItem('noticias', JSON.stringify(noticias));
    cargarNoticias();
}

// =======================
// CALENDARIO ESCOLAR
// =======================

// Mostrar formulario de evento
function mostrarFormularioEvento() {
    const usuario = localStorage.getItem('usuario');
    const escritoresAutorizados = JSON.parse(localStorage.getItem('autorizadosCalendario') || '[]');
    if (!escritoresAutorizados.includes(usuario)) {
        alert("No estás autorizado para agregar eventos al calendario.");
        return;
    }
    document.getElementById('calendarioContainer').style.display = 'block';
}

// Ocultar formulario de evento
function ocultarFormularioEvento() {
    document.getElementById('calendarioContainer').style.display = 'none';
}

// Guardar evento en localStorage
document.getElementById('formEvento')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const fecha = document.getElementById('fechaEvento').value;
    const titulo = document.getElementById('tituloEvento').value.trim();
    const tipo = document.getElementById('tipoEvento').value;

    if (!fecha || !titulo || !tipo) {
        alert("Complete todos los campos del evento.");
        return;
    }

    let eventos = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
    eventos.push({ fecha, titulo, tipo });
    localStorage.setItem('eventosCalendario', JSON.stringify(eventos));

    document.getElementById('fechaEvento').value = '';
    document.getElementById('tituloEvento').value = '';
    document.getElementById('tipoEvento').value = '';
    cargarEventos();
    alert("Evento agregado correctamente!");
});

// =======================
// Cargar eventos del calendario
// =======================
function cargarEventos() {
    const cont = document.getElementById('eventosContainer');
    if (!cont) return;
    cont.innerHTML = '';

    const eventos = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
    if (eventos.length === 0) {
        cont.innerHTML = '<p>No hay eventos agregados.</p>';
        return;
    }

    eventos.forEach((e, i) => {
        const div = document.createElement('div');
        div.className = 'evento-mini';
        div.innerHTML = `<strong>${e.fecha}:</strong> ${e.titulo} <em>(${e.tipo.replace('titulo-', '')})</em>`;

        // Botón eliminar evento
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => {
            if (!confirm("¿Desea eliminar este evento?")) return;
            let eventosActuales = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
            eventosActuales.splice(i, 1);
            localStorage.setItem('eventosCalendario', JSON.stringify(eventosActuales));
            cargarEventos();
        };
        div.appendChild(btnEliminar);

        cont.appendChild(div);
    });
}

// =======================
// Verifica si el usuario está autorizado para calendario
// =======================
function verificarAutorizacionCalendario() {
    const usuario = localStorage.getItem('usuario');
    const btn = document.getElementById('btnAgregarEvento');
    const escritoresAutorizados = JSON.parse(localStorage.getItem('autorizadosCalendario') || '[]');
    if (!escritoresAutorizados.includes(usuario)) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'inline-block';
    }
}
