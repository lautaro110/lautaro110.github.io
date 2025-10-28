// ===============================
// calendario.js - Módulo de Calendario Escolar (v2 con edición y JSON externo)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const formEvento = document.getElementById("formEvento");
  const calendarioContainer = document.getElementById("calendarioContainer");
  const misNoticias = document.querySelector(".mis-noticias");
  const botonesWrapper = document.getElementById("toggleBotones");
  const fechaInput = document.getElementById("fechaEvento");
  const calendarBody = document.getElementById("calendarBody");
  const monthYear = document.getElementById("monthYear");
  let eventos = [];
  let eventoEditando = null;

  // ===============================
  // BOTONES DE MODO
  // ===============================
  botonesWrapper.innerHTML = "";
  const btnNoticia = document.createElement("button");
  btnNoticia.className = "btn-primario";
  btnNoticia.textContent = "🖋️ Crear Noticia";

  const btnCalendario = document.createElement("button");
  btnCalendario.className = "btn-secundario";
  btnCalendario.textContent = "🗓️ Crear Calendario";

  botonesWrapper.appendChild(btnNoticia);
  botonesWrapper.appendChild(btnCalendario);

  btnNoticia.addEventListener("click", () => {
    document.getElementById("contenidoNoticias").style.display = "block";
    misNoticias.style.display = "block";
    calendarioContainer.style.display = "none";
    btnNoticia.className = "btn-primario";
    btnCalendario.className = "btn-secundario";
  });

  btnCalendario.addEventListener("click", () => {
    document.getElementById("contenidoNoticias").style.display = "none";
    misNoticias.style.display = "none";
    calendarioContainer.style.display = "block";
    btnCalendario.className = "btn-primario";
    btnNoticia.className = "btn-secundario";
  });

  // ===============================
  // CALENDARIO VISUAL
  // ===============================
  let currentDate = new Date();

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYear.textContent = currentDate.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });
    calendarBody.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay() || 7;
    const lastDay = new Date(year, month + 1, 0).getDate();
    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 1; j <= 7; j++) {
        const cell = document.createElement("td");

        if (i === 0 && j < firstDay) {
          cell.textContent = "";
          row.appendChild(cell);
          continue;
        }

        if (date > lastDay) {
          cell.textContent = "";
          row.appendChild(cell);
          continue;
        }

        cell.textContent = date;
        const cellDate = new Date(year, month, date);
        if (cellDate < new Date()) cell.style.color = "#aaa";

        cell.addEventListener("click", () => {
          fechaInput.value = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(date).padStart(2, "0")}`;
        });

        row.appendChild(cell);
        date++;
      }
      calendarBody.appendChild(row);
    }

    marcarEventos();
  }

  document
    .getElementById("prevMonth")
    .addEventListener("click", () => changeMonth(-1));
  document
    .getElementById("nextMonth")
    .addEventListener("click", () => changeMonth(1));

  function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
  }

  // ===============================
  // CRUD EVENTOS
  // ===============================
  formEvento.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fecha = fechaInput.value;
    const titulo = document.getElementById("tituloEvento").value.trim();
    const tipo = document.getElementById("tipoEvento").value;
    const descripcion = document.getElementById("descripcionEvento").value.trim();
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFin = document.getElementById("horaFin").value;

    if (!fecha || !titulo || !tipo || !horaInicio || !horaFin) {
      alert("Completa todos los campos requeridos.");
      return;
    }

    if (eventoEditando) {
      // Modo edición
      const index = eventos.findIndex((e) => e.id === eventoEditando);
      if (index !== -1) {
        eventos[index] = { ...eventos[index], fecha, titulo, tipo, descripcion, horaInicio, horaFin };
      }
      eventoEditando = null;
    } else {
      // Nuevo evento
      eventos.push({
        id: Date.now(),
        fecha,
        titulo,
        tipo,
        descripcion,
        horaInicio,
        horaFin,
      });
    }

    await guardarEventosJSON();
    formEvento.reset();
    mostrarEventos();
    renderCalendar();
  });

  async function eliminarEvento(id) {
    eventos = eventos.filter((e) => e.id !== id);
    await guardarEventosJSON();
    mostrarEventos();
    renderCalendar();
  }

  function editarEvento(id) {
    const ev = eventos.find((e) => e.id === id);
    if (!ev) return;
    eventoEditando = id;
    fechaInput.value = ev.fecha;
    document.getElementById("tituloEvento").value = ev.titulo;
    document.getElementById("tipoEvento").value = ev.tipo;
    document.getElementById("descripcionEvento").value = ev.descripcion;
    document.getElementById("horaInicio").value = ev.horaInicio;
    document.getElementById("horaFin").value = ev.horaFin;
    alert("Modo edición activado. Realiza cambios y guarda el evento.");
  }

  // ===============================
  // MOSTRAR EVENTOS
  // ===============================
  function mostrarEventos() {
    const contenedor = document.getElementById("eventosContainer");
    contenedor.innerHTML = "";
    if (!eventos.length) {
      contenedor.innerHTML = `<p class="placeholder">No hay eventos cargados aún.</p>`;
      return;
    }

    eventos.forEach((ev) => {
      const card = document.createElement("div");
      card.className = "evento-card";
      let color = "#1a73e8";
      if (ev.tipo === "titulo-feriado") color = "#d80000";
      if (ev.tipo === "titulo-no-clases") color = "#ff8c00";
      card.style.borderLeft = `5px solid ${color}`;
      card.innerHTML = `
        <strong>${ev.titulo}</strong><br>
        📅 ${ev.fecha}<br>
        🕒 ${ev.horaInicio} - ${ev.horaFin}<br>
        <em>${ev.descripcion || "Sin descripción"}</em>
        <div style="margin-top:8px;">
          <button class="btn-editar">✏️ Editar</button>
          <button class="btn-eliminar">🗑️ Eliminar</button>
        </div>
      `;
      card.querySelector(".btn-editar").addEventListener("click", () => editarEvento(ev.id));
      card.querySelector(".btn-eliminar").addEventListener("click", () => eliminarEvento(ev.id));
      contenedor.appendChild(card);
    });
  }

  // ===============================
  // MARCAR EVENTOS EN CALENDARIO
  // ===============================
  function marcarEventos() {
    const cells = calendarBody.getElementsByTagName("td");
    for (let cell of cells) {
      if (!cell.textContent) continue;
      const cellDateStr = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}-${String(cell.textContent).padStart(2, "0")}`;
      eventos.forEach((ev) => {
        if (ev.fecha === cellDateStr) {
          if (ev.tipo === "titulo-feriado") cell.classList.add("evento-feriado");
          else if (ev.tipo === "titulo-no-clases") cell.classList.add("evento-no-clases");
          else cell.classList.add("evento-importante");
        }
      });
    }
  }

  // ===============================
  // JSON (CARGAR / GUARDAR)
  // ===============================
  async function cargarEventosJSON() {
    try {
      const res = await fetch("../date/calendario.php");
      if (!res.ok) throw new Error("Error al cargar calendario.json");
      eventos = await res.json();
      eliminarEventosPasados();
      mostrarEventos();
      renderCalendar();
    } catch (err) {
      console.error("Error cargando eventos:", err);
    }
  }

  async function guardarEventosJSON() {
    await fetch("../date/calendario.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventos),
    });
  }

  // ===============================
  // ELIMINAR EVENTOS PASADOS
  // ===============================
  function eliminarEventosPasados() {
    const hoy = new Date();
    eventos = eventos.filter((ev) => new Date(ev.fecha) >= hoy);
  }

  // ===============================
  // INICIO
  // ===============================
  cargarEventosJSON();
});
