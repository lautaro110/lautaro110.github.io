document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnCalendarioFlotante');
  const panel = document.getElementById('panelCalendario');
  const cerrar = document.getElementById('cerrarPanelCalendario');
  const lista = document.getElementById('panelEventosLista');

  if (!btn || !panel || !lista) return;

  const abrir = () => {
    panel.classList.add('abierto');
    panel.setAttribute('aria-hidden', 'false');
    cargarEventos();
  };

  const ocultar = () => {
    panel.classList.remove('abierto');
    panel.setAttribute('aria-hidden', 'true');
  };

  btn.addEventListener('click', abrir);
  if (cerrar) cerrar.addEventListener('click', ocultar);

  function cargarEventos() {
    let eventos = [];
    try {
      eventos = JSON.parse(localStorage.getItem('eventosCalendario') || '[]');
    } catch (e) {
      eventos = [];
    }

    // Filtrar pasados y ordenar asc
    const hoy = new Date();
    eventos = eventos
      .filter(e => new Date(e.fecha) >= hoy)
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    lista.innerHTML = '';

    if (eventos.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No hay fechas importantes por el momento.';
      li.style.fontStyle = 'italic';
      li.style.color = 'gray';
      lista.appendChild(li);
      return;
    }

    eventos.forEach(e => {
      const li = document.createElement('li');

      let clase = '';
      let icono = '';
      if (e.tipo === 'titulo-feriado') { clase = 'feriado'; icono = '📅'; }
      else if (e.tipo === 'titulo-no-clases') { clase = 'no-clases'; icono = '⚠️'; }
      else if (e.tipo === 'titulo-evento') { clase = 'evento-importante'; icono = '🎉'; }

      li.className = clase;
      li.innerHTML = `<span class="fecha">${icono} ${e.fecha}:</span> ${e.titulo}`;
      lista.appendChild(li);
    });
  }
});


