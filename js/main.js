// Carrusel dinámico y lista de noticias
function loadNoticias() {
    fetch('php/get_news.php')
    .then(res => res.json())
    .then(noticias => {
        const lista = document.getElementById('noticiasList');
        const carousel = document.getElementById('carouselTrack');
        lista.innerHTML = '';
        carousel.innerHTML = '';

        noticias.forEach((n, idx) => {
            // Carrusel si principal
            if(n.principal == 1){
                const activeClass = carousel.children.length === 0 ? 'active' : '';
                const item = document.createElement('div');
                item.className = `carousel-item ${activeClass}`;
                item.innerHTML = `
                    <img src="img/noticias/${n.imagen}" class="d-block w-100" alt="${n.titulo}">
                    <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
                        <h5>${n.titulo}</h5>
                        <p>${n.resumen}</p>
                    </div>
                `;
                carousel.appendChild(item);
            }

            // Lista de noticias
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4 noticia-card';
            card.dataset.title = n.titulo;
            card.innerHTML = `
                <div class="card h-100">
                    <img src="img/noticias/${n.imagen}" class="card-img-top" alt="${n.titulo}">
                    <div class="card-body">
                        <h5 class="card-title">${n.titulo}</h5>
                        <p class="card-text">${n.resumen}</p>
                        <a href="php/noticia.php?id=${n.id}" class="btn btn-primary">Leer más</a>
                    </div>
                </div>
            `;
            lista.appendChild(card);
        });
    });
}

// Buscador simple
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('searchInput').addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const cards = document.querySelectorAll('.noticia-card');
        cards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    });

    // Cargar noticias al iniciar
    loadNoticias();
});
