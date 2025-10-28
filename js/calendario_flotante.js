// ===============================
// calendario_flotante.js - Panel de eventos flotante desde calendario.json
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnCalendarioFlotante');
  const panel = document.getElementById('panelCalendario');
  const cerrar = document.getElementById('cerrarPanelCalendario');
  const lista = document.getElementById('panelEventosLista');

  if (!btn || !panel || !lista) return;

  // Mostrar panel
  btn.addEventListener('click', () => {
    panel.classList.toggle('abierto');
    if (panel.classList.contains('abierto')) cargarEventos();
  });

  // Cerrar panel
  if (cerrar) cerrar.addEventListener('click', () => panel.classList.remove('abierto'));

  // ===============================
  // Cargar eventos desde calendario.json
  // ===============================
  async function cargarEventos() {
    lista.innerHTML = `<li style="font-style:italic;color:gray;">Cargando eventos...</li>`;
    try {
      const res = await fetch('date/calendario.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Error al cargar calendario.json');
      let eventos = await res.json();

      // Si no hay eventos
      if (!Array.isArray(eventos) || eventos.length === 0) {
        lista.innerHTML = `<li style="font-style:italic;color:gray;">No hay fechas importantes por el momento.</li>`;
        return;
      }

      // Ordenar del más reciente al más antiguo
      eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      // Mostrar eventos
      lista.innerHTML = '';
      eventos.forEach(e => {
        const li = document.createElement('li');
        let clase = '', icono = '';
        if (e.tipo === 'titulo-feriado') { clase='feriado'; icono='📅'; }
        else if (e.tipo === 'titulo-no-clases') { clase='no-clases'; icono='⚠️'; }
        else { clase='evento-importante'; icono='🎉'; }

        li.className = clase;
        li.innerHTML = `<span class="fecha">${icono} ${e.fecha}:</span> ${e.titulo}`;

        // Descripción desplegable
        if (e.descripcion && e.descripcion.trim() !== '') {
          const desc = document.createElement('div');
          desc.className = 'evento-descripcion';
          desc.textContent = e.descripcion;

          li.addEventListener('click', () => {
            desc.style.display = desc.style.display === 'block' ? 'none' : 'block';
          });

          li.appendChild(desc);
        }

        lista.appendChild(li);
      });

    } catch (err) {
      console.error('Error cargando eventos:', err);
      lista.innerHTML = `<li style="color:red;">Error al cargar los eventos.</li>`;
    }
  }
});
