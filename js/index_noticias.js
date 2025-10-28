// =======================
// Cargar todas las noticias desde noticias.json
// =======================
async function cargarNoticias() {
    const cont = document.getElementById('noticiasContainer');
    cont.innerHTML = '<p>Cargando noticias...</p>';

    try {
        const res = await fetch('date/noticias.json', { cache: 'no-store' });
        if (!res.ok) throw new Error("No se pudo cargar noticias.json");

        let noticias = await res.json();
        if (!Array.isArray(noticias)) throw new Error("Formato inválido en noticias.json");

        // Ordenar por fecha descendente (más reciente primero)
        noticias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // ----------------------------
        // Renderizar grid de noticias
        // ----------------------------
        cont.innerHTML = '';
        noticias.forEach(n => {
            const div = document.createElement('div');
            div.className = 'noticia-mini';
            div.innerHTML = `
                ${n.imagen ? `<img src="${n.imagen}" alt="${n.titulo}">` : ''}
                <h3>${n.titulo}</h3>
                <p>${n.contenido.substring(0, 100)}...</p>
            `;

            div.addEventListener('click', () => {
                window.location.href = `pagina/ver_noticia.html?id=${n.id}`;
            });

            cont.appendChild(div);
        });

        // ----------------------------
        // Cargar slider con las 5 noticias más recientes
        // ----------------------------
        cargarNoticiasSlider(noticias);

    } catch (err) {
        console.error(err);
        cont.innerHTML = `<p style="color:red;">Error al cargar noticias: ${err.message}</p>`;
    }
}

// =======================
// Slider con máximo 5 noticias más recientes
// =======================
let sliderIndex = 0;
let sliderNoticiasGlobal = [];
const sliderIntervalTime = 4000;

function cargarNoticiasSlider(noticias) {
    const cont = document.getElementById('noticiasSlider');
    if (!cont) return;

    // Tomar máximo 5 noticias más recientes
    sliderNoticiasGlobal = noticias.slice(0, 5);
    cont.innerHTML = '';

    sliderNoticiasGlobal.forEach((n, i) => {
        if (!n.imagen) return;

        const a = document.createElement('a');
        a.href = `pagina/ver_noticia.html?id=${n.id}`;
        a.className = 'slide';
        a.style.opacity = '0';

        const img = document.createElement('img');
        img.src = n.imagen.trim() !== '' ? n.imagen : "img/placeholder.jpg";
        img.alt = n.titulo;

        a.appendChild(img);
        cont.appendChild(a);
    });

    agregarPuntosSlider();
    mostrarSlide(sliderIndex);

    setInterval(() => {
        sliderIndex = (sliderIndex + 1) % sliderNoticiasGlobal.length;
        mostrarSlide(sliderIndex);
    }, sliderIntervalTime);
}

// =======================
// Mostrar slide activo y actualizar puntos
// =======================
function mostrarSlide(index) {
    const slides = document.querySelectorAll('#noticiasSlider .slide');
    const puntos = document.querySelectorAll('#puntosSlider span');

    slides.forEach((slide, i) => {
        slide.style.opacity = (i === index) ? '1' : '0';
        slide.style.transition = 'opacity 0.6s ease';
        slide.style.pointerEvents = (i === index) ? 'auto' : 'none'; // solo slide visible clicable
    });

    puntos.forEach((p, i) => {
        p.classList.toggle('activo', i === index);
    });
}

// =======================
// Crear puntos de navegación del slider
// =======================
function agregarPuntosSlider() {
    let puntosCont = document.getElementById('puntosSlider');
    if (!puntosCont) {
        puntosCont = document.createElement('div');
        puntosCont.id = 'puntosSlider';
        puntosCont.style.textAlign = 'center';
        puntosCont.style.marginTop = '10px';
        document.querySelector('.slider').appendChild(puntosCont);
    }

    puntosCont.innerHTML = '';
    sliderNoticiasGlobal.forEach((_, i) => {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.width = '12px';
        span.style.height = '12px';
        span.style.margin = '0 5px';
        span.style.borderRadius = '50%';
        span.style.background = '#ccc';
        span.style.cursor = 'pointer';
        span.addEventListener('click', () => {
            sliderIndex = i;
            mostrarSlide(sliderIndex);
        });
        puntosCont.appendChild(span);
    });
}

// =======================
// Ejecutar al cargar la página
// =======================
document.addEventListener('DOMContentLoaded', () => {
    cargarNoticias();
});
