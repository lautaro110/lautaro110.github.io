document.addEventListener('DOMContentLoaded', () => {
    // Actualiza la barra de navegación
    if (typeof actualizarNav === 'function') actualizarNav();

    const cont = document.getElementById('eventosCalendarioContainer');

    // Traer eventos de localStorage
    let eventos = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');

    // Filtrar eventos pasados
    const hoy = new Date();
    eventos = eventos.filter(e => new Date(e.fecha) >= hoy);

    // Guardar nuevamente los eventos filtrados
    localStorage.setItem('eventosCalendario', JSON.stringify(eventos));

    // Mostrar mensaje si no hay eventos
    if (eventos.length === 0) {
        cont.innerHTML = '<li class="no-eventos">No hay fechas importantes por el momento.</li>';
        return;
    }

    // Ordenar eventos por fecha ascendente
    eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Mostrar eventos
    eventos.forEach(e => {
        const li = document.createElement('li');

        // Colores y iconos según tipo
        let clase = '';
        let icono = '';
        if (e.tipo === 'titulo-feriado') {
            clase = 'feriado';
            icono = '📅';
        } else if (e.tipo === 'titulo-no-clases') {
            clase = 'no-clases';
            icono = '⚠️';
        } else if (e.tipo === 'titulo-evento') {
            clase = 'evento-importante';
            icono = '🎉';
        }

        li.className = `evento ${clase}`;
        li.innerHTML = `<span class="fecha">${icono} ${e.fecha}:</span> ${e.titulo}`;
        cont.appendChild(li);
    });
});
