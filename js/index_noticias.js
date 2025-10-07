// =======================
// Cargar todas las noticias (miniaturas en el index)
// =======================
function cargarNoticias() {
    const cont = document.getElementById('noticiasContainer');
    cont.innerHTML = '';
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    if (noticias.length === 0) {
        cont.innerHTML = '<p>No hay noticias disponibles.</p>';
        return;
    }

    // Ordenar por fecha descendente
    noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

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
            // Guardar índice real en localStorage
            const indexReal = JSON.parse(localStorage.getItem('noticias'))
                .findIndex(nn => nn.titulo === n.titulo && nn.fecha === n.fecha);
            localStorage.setItem('noticiaActual', indexReal);
            window.location.href = 'pagina/ver_noticia.html';
        });

        cont.appendChild(div);
    });
}

// =======================
// Cargar noticias en el SLIDER
// =======================
function cargarNoticiasSlider() {
    const cont = document.getElementById('noticiasSlider');
    if (!cont) return;

    let noticias = JSON.parse(localStorage.getItem('noticias') || '[]');

    // Ordenar por fecha descendente
    noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    cont.innerHTML = '';

    noticias.forEach((n, i) => {
        if (!n.imagen) return; // solo mostrar si tiene imagen

        const a = document.createElement('a');
        a.href = "pagina/ver_noticia.html";
        a.style.animationDelay = `${i * 4}s`; // cada noticia dura 4s

        a.addEventListener('click', () => {
            // Buscar índice real en localStorage
            const indexReal = JSON.parse(localStorage.getItem('noticias'))
                .findIndex(nn => nn.titulo === n.titulo && nn.fecha === n.fecha);
            localStorage.setItem('noticiaActual', indexReal);
        });

        const img = document.createElement('img');
        img.src = n.imagen && n.imagen.trim() !== '' 
                  ? n.imagen 
                  : "img/placeholder.jpg";  // placeholder si no tiene
        img.alt = n.titulo;

        a.appendChild(img);
        cont.appendChild(a);
    });
}

// =======================
// Ejecutar al cargar la página
// =======================
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticias();       // carga las miniaturas de noticias
    cargarNoticiasSlider(); // carga el slider de noticias
});
