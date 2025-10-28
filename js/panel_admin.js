// ===============================
// panel_admin.js - XAMPP con PHP
// Integrado: manejo usuarios + render noticias + filtros + ver y editar noticia
// ===============================
(function () {
  const $ = s => document.querySelector(s);

  // ===============================
  // Cargar usuarios desde PHP (usuarios.php)
  // ===============================
  async function fetchUsuarios() {
    try {
      const res = await fetch("../date/usuarios.php", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar usuarios.json");
      return await res.json();
    } catch (e) {
      console.error("Error cargando usuarios:", e);
      return [];
    }
  }

  let users = [];
  let noticias = [];

  const tbody = () => $("#usersTable tbody");

  // ===============================
  // Inicialización
  // ===============================
  async function init() {
    bindUI();
    users = await fetchUsuarios();
    renderAll();
    await fetchNoticias(); // carga noticias al iniciar
  }

  // ===============================
  // Eventos UI
  // ===============================
  function bindUI() {
    $("#search").addEventListener("input", renderAll);
    $("#filterRole").addEventListener("change", renderAll);
    $("#reload").addEventListener("click", async () => {
      users = await fetchUsuarios();
      renderAll();
    });
  }

  function renderAll() {
    renderCounts();
    renderUsersTable();
  }

  // ===============================
  // Contadores
  // ===============================
  function renderCounts() {
    const filteredUsers = users.filter(u => u.rol !== "admin");
    const tot = filteredUsers.length;
    const escritores = filteredUsers.filter(u => u.rol === "escritor").length;
    const usuarios = filteredUsers.filter(u => u.rol === "usuario" || !u.rol).length;
    $("#counts").innerText = `Total: ${tot} • Usuarios: ${usuarios} • Escritores: ${escritores}`;
  }

  function escapeHtml(s) {
    if (s === undefined || s === null) return "";
    return String(s).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[ch]);
  }

  // ===============================
  // Render tabla de usuarios
  // ===============================
  function renderUsersTable() {
    const q = $("#search").value.trim().toLowerCase();
    const roleFilter = $("#filterRole").value;

    const list = users.filter(u => {
      if (u.rol === "admin") return false;
      if (roleFilter !== "all" && u.rol !== roleFilter) return false;
      if (!q) return true;
      const username = (u.nombre || u.username || "").toLowerCase();
      const email = (u.correo || u.email || "").toLowerCase();
      return username.includes(q) || email.includes(q);
    });

    const tb = tbody();
    tb.innerHTML = "";

    if (list.length === 0) {
      tb.innerHTML = `<tr><td colspan="5"><em>No hay usuarios disponibles</em></td></tr>`;
      return;
    }

    for (const u of list) {
      const tr = document.createElement("tr");
      const username = escapeHtml(u.nombre || u.username || "Sin nombre");
      const email = escapeHtml(u.correo || u.email || "");
      const role = escapeHtml(u.rol || "usuario");
      const calendar = !!u.calendar;

      tr.innerHTML = `
        <td>${username}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${calendar ? "Sí" : "No"}</td>
        <td class="actions"></td>
      `;

      const actions = tr.querySelector(".actions");

      const promoteBtn = document.createElement("button");
      promoteBtn.className = u.rol === "escritor" ? "btn-demote" : "btn-promote";
      promoteBtn.textContent = u.rol === "escritor" ? "Degradar a usuario" : "Ascender a escritor";
      promoteBtn.addEventListener("click", () => toggleWriterRole(u));
      actions.appendChild(promoteBtn);

      if (u.rol === "escritor") {
        const accessBtn = document.createElement("button");
        accessBtn.className = calendar ? "btn-remove-access" : "btn-access";
        accessBtn.textContent = calendar ? "Quitar acceso" : "Dar acceso";
        accessBtn.addEventListener("click", () => toggleCalendar(u));
        actions.appendChild(accessBtn);
      }

      tb.appendChild(tr);
    }
  }

  async function sendPatch(user, patch) {
    try {
      const endpoint = "../date/usuarios.php?id=" + encodeURIComponent(user.id);
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Error PATCH:", data);
        showMessage("Error al guardar cambios");
        return false;
      }
      return true;
    } catch (e) {
      console.error("Fallo conexión con usuarios.php:", e);
      showMessage("Error de conexión con el servidor");
      return false;
    }
  }

  async function toggleWriterRole(user) {
    const newRole = user.rol === "escritor" ? "usuario" : "escritor";
    const ok = await sendPatch(user, { rol: newRole });
    if (ok) {
      user.rol = newRole;
      showMessage(`${user.nombre} ahora es ${newRole}`);
      renderAll();
    }
  }

  async function toggleCalendar(user) {
    const newState = !user.calendar;
    const ok = await sendPatch(user, { calendar: newState });
    if (ok) {
      user.calendar = newState;
      showMessage(`${user.nombre} ${newState ? "tiene acceso" : "ya no tiene acceso"} al calendario`);
      renderAll();
    }
  }

  function showMessage(msg) {
    const counts = $("#counts");
    const el = document.createElement("div");
    el.className = "message";
    el.textContent = msg;
    counts.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  // ===============================
  // SECCIÓN DE NOTICIAS (con filtro avanzado)
  // ===============================
  async function fetchNoticias() {
    try {
      const res = await fetch("../php/noticias.php", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar noticias (php)");
      noticias = await res.json();
      renderFiltrosNoticias();
      renderNoticias();
    } catch (e) {
      console.error("Error cargando noticias:", e);
      const cont = $("#newsList");
      if (cont) cont.innerHTML = `<div class="placeholder"><em>⚠️ No se pudieron cargar las noticias.</em></div>`;
    }
  }

  function renderFiltrosNoticias() {
    const container = $("#filtroNoticias");
    if (!container) return;

    const autores = [...new Set(noticias.map(n => n.autor).filter(Boolean))];

    container.innerHTML = `
      <div class="filtros" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px;">
        <input type="text" id="filtroTexto" placeholder="Buscar por título o contenido" style="flex:1;min-width:200px;padding:6px 10px;border-radius:6px;border:1px solid #ccc;">
        <select id="filtroAutor" style="padding:6px 10px;border-radius:6px;border:1px solid #ccc;">
          <option value="">Todos los autores</option>
          ${autores.map(a => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join("")}
        </select>
        <input type="date" id="filtroFecha" style="padding:6px 10px;border-radius:6px;border:1px solid #ccc;">
        <button id="btnLimpiarFiltros" style="padding:6px 10px;border-radius:6px;border:none;background:#ccc;">Limpiar</button>
      </div>
    `;

    $("#filtroTexto").addEventListener("input", renderNoticias);
    $("#filtroAutor").addEventListener("change", renderNoticias);
    $("#filtroFecha").addEventListener("change", renderNoticias);
    $("#btnLimpiarFiltros").addEventListener("click", () => {
      $("#filtroTexto").value = "";
      $("#filtroAutor").value = "";
      $("#filtroFecha").value = "";
      renderNoticias();
    });
  }

  function renderNoticias() {
    const cont = $("#newsList");
    if (!cont) return;

    const texto = ($("#filtroTexto")?.value || "").toLowerCase();
    const autor = $("#filtroAutor")?.value || "";
    const fecha = $("#filtroFecha")?.value || "";

    const filtradas = noticias.filter(n => {
      const titulo = (n.titulo || "").toLowerCase();
      const contenido = (n.contenido || "").toLowerCase();
      const fechaNoticia = (n.fecha || "").split(" ")[0];
      const matchTexto = titulo.includes(texto) || contenido.includes(texto);
      const matchAutor = autor ? n.autor === autor : true;
      const matchFecha = fecha ? fechaNoticia === fecha : true;
      return matchTexto && matchAutor && matchFecha;
    });

    if (filtradas.length === 0) {
      cont.innerHTML = `<div class="placeholder"><em>No hay noticias que coincidan con los filtros.</em></div>`;
      return;
    }

    cont.classList.add("noticias-grid");
    cont.innerHTML = "";

    for (const n of filtradas) {
      const card = document.createElement("article");
      card.className = "noticia-mini";

      const imagenRuta = n.imagen ? `../${n.imagen}` : "../date/img/default.jpg";
      const textoPlano = (n.contenido || "").replace(/&nbsp;/g, " ").replace(/<\/?[^>]+(>|$)/g, "");
      const extracto = textoPlano.length > 120 ? textoPlano.slice(0, 120) + "..." : textoPlano;

      card.innerHTML = `
        <div style="width:100%;height:180px;overflow:hidden;">
          <img src="${escapeHtml(imagenRuta)}" alt="${escapeHtml(n.titulo)}" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <div style="padding:12px;display:flex;flex-direction:column;gap:8px;">
          <h3 style="margin:0;color:#0b3b66;">${escapeHtml(n.titulo)}</h3>
          <small style="color:#666;">Por ${escapeHtml(n.autor)} • ${escapeHtml(n.fecha)}</small>
          <p style="margin:0;color:#333;flex-grow:1;">${escapeHtml(extracto)}</p>
          <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:8px;">
            <button class="btn-view">👁️ Ver</button>
            <button class="btn-edit">✏️ Editar</button>
            <button class="btn-delete">🗑️ Eliminar</button>
          </div>
        </div>
      `;

      card.querySelector(".btn-view").addEventListener("click", () => viewNoticia(n));
      card.querySelector(".btn-edit").addEventListener("click", () => editarNoticiaDesdeAdmin(n.id));
      card.querySelector(".btn-delete").addEventListener("click", () => {
        if (confirm(`¿Eliminar la noticia "${n.titulo}"?`)) eliminarNoticia(n.id);
      });

      cont.appendChild(card);
    }
  }

  // ===============================
  // 🔹 Ver noticia
  // ===============================
  function viewNoticia(noticia) {
    if (!noticia.id) {
      alert("Error: la noticia no tiene un ID válido.");
      return;
    }
    window.location.href = `../pagina/ver_noticia.html?id=${encodeURIComponent(noticia.id)}`;
  }

  // ===============================
  // 🔹 Editar noticia desde el panel ADMIN
  // ===============================
  function editarNoticiaDesdeAdmin(id) {
    if (!id) {
      alert("Error: ID de noticia no válido.");
      return;
    }
    localStorage.setItem("idEditarNoticia", id);
    window.location.href = "../pagina/panel_escritor.html";
  }

  document.addEventListener("DOMContentLoaded", init);
})();
