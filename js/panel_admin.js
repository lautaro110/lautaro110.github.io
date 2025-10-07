document.addEventListener('DOMContentLoaded', () => {
    const usuarioActual = localStorage.getItem('usuario') || '';
    document.getElementById('usuarioActual').innerText = usuarioActual;

    // Inicializar lista de autorizados si no existe
    if (!localStorage.getItem('autorizadosCalendario')) {
        localStorage.setItem('autorizadosCalendario', JSON.stringify([]));
    }

    cargarEscritores();
    cargarNoticiasAdmin();
    actualizarNav();

    document.getElementById('btnAgregarEscritor').addEventListener('click', agregarEscritor);
});

// =======================
// Manejo de Escritores
// =======================
function agregarEscritor() {
    const usuario = document.getElementById('nuevoUsuario').value.trim();
    const password = document.getElementById('nuevaPassword').value.trim();
    if (!usuario || !password) { alert("Complete todos los campos"); return; }

    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
    if (usuarios[usuario]) { alert("El usuario ya existe"); return; }

    usuarios[usuario] = { usuario, password, rol: "escritor" };
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    document.getElementById('nuevoUsuario').value = '';
    document.getElementById('nuevaPassword').value = '';
    cargarEscritores();
    alert("Escritor agregado correctamente");
}

// =======================
// Cargar Escritores con botón calendario
// =======================
function cargarEscritores() {
    const lista = document.getElementById('listaEscritores');
    lista.innerHTML = '';
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
    const autorizados = JSON.parse(localStorage.getItem('autorizadosCalendario') || '[]');

    for (const key in usuarios) {
        if (usuarios[key].rol === 'escritor') {
            const li = document.createElement('li');
            li.textContent = usuarios[key].usuario + ' ';

            // Botón Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarEscritor(usuarios[key].usuario);
            li.appendChild(btnEliminar);

            // Botón Autorizar/Desautorizar calendario
            const btnCal = document.createElement('button');
            btnCal.textContent = autorizados.includes(usuarios[key].usuario) ? 'Autorizado' : 'No autorizado';
            btnCal.style.backgroundColor = autorizados.includes(usuarios[key].usuario) ? 'green' : 'red';
            btnCal.style.marginLeft = '0.5rem';
            btnCal.onclick = () => toggleAutorizacionCalendario(usuarios[key].usuario, btnCal);
            li.appendChild(btnCal);

            lista.appendChild(li);
        }
    }
}

// =======================
// Eliminar Escritor
// =======================
function eliminarEscritor(usuario) {
    if (!confirm(`¿Seguro que querés eliminar a ${usuario}?`)) return;
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '{}');
    delete usuarios[usuario];
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // También eliminar autorización si existía
    let autorizados = JSON.parse(localStorage.getItem('autorizadosCalendario') || '[]');
    autorizados = autorizados.filter(u => u !== usuario);
    localStorage.setItem('autorizadosCalendario', JSON.stringify(autorizados));

    cargarEscritores();
}

// =======================
// Autorizar/Desautorizar calendario
// =======================
function toggleAutorizacionCalendario(usuario, boton) {
    let autorizados = JSON.parse(localStorage.getItem('autorizadosCalendario') || '[]');
    if (autorizados.includes(usuario)) {
        // Desautorizar
        autorizados = autorizados.filter(u => u !== usuario);
        boton.textContent = 'No autorizado';
        boton.style.backgroundColor = 'red';
    } else {
        // Autorizar
        autorizados.push(usuario);
        boton.textContent = 'Autorizado';
        boton.style.backgroundColor = 'green';
    }
    localStorage.setItem('autorizadosCalendario', JSON.stringify(autorizados));
}

// =======================
// Noticias (admin ve todas)
// =======================
function cargarNoticiasAdmin() {
    const cont = document.getElementById('noticiasContainer');
    cont.innerHTML = '';
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    if (noticias.length === 0) {
        cont.innerHTML = '<p>No hay noticias publicadas.</p>';
        return;
    }

    noticias.forEach((n, index) => {
        const div = document.createElement('div');
        div.className = 'noticia-mini';
        div.innerHTML = `
            ${n.imagen ? `<img src="${n.imagen}" alt="${n.titulo}">` : ''}
            <h3>${n.titulo}</h3>
            <small>Autor: ${n.autor} | Fecha: ${n.fecha}</small>
            <p>${n.contenido.substring(0, 100)}...</p>
        `;

        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = (e) => {
            e.stopPropagation();
            eliminarNoticiaAdmin(index);
        };
        div.appendChild(btnEliminar);

        // Click para ver noticia completa
        div.addEventListener('click', () => {
            localStorage.setItem('noticiaActual', index);
            window.location.href = 'ver_noticia.html';
        });

        cont.appendChild(div);
    });
}

function eliminarNoticiaAdmin(index) {
    if (!confirm("¿Desea eliminar esta noticia?")) return;
    let noticias = JSON.parse(localStorage.getItem('noticias') || '[]');
    noticias.splice(index, 1);
    localStorage.setItem('noticias', JSON.stringify(noticias));
    cargarNoticiasAdmin();
}
