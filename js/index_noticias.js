// =======================
// Cargar todas las noticias
// =======================
function cargarNoticias() {
    const cont = document.getElementById('noticiasContainer');
    cont.innerHTML = '';
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    if (noticias.length === 0) {
        cont.innerHTML = '<p>No hay noticias disponibles.</p>';
        return;
    }

    noticias.forEach((n, index) => {
        const div = document.createElement('div');
        div.className = 'noticia-mini';
        div.innerHTML = `
            ${n.imagen ? `<img src="${n.imagen}" alt="${n.titulo}">` : ''}
            <h3>${n.titulo}</h3>
            <p>${n.contenido.substring(0, 100)}...</p>
        `;

        // Click para ver noticia completa
        div.addEventListener('click', () => {
            localStorage.setItem('noticiaActual', index);
            window.location.href = 'pagina/ver_noticia.html';
        });

        cont.appendChild(div);
    });
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', cargarNoticias);
