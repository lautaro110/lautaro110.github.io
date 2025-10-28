// navbar.js - buscador con autocompletado
// ===============================
// NAVBAR UNIVERSAL - ESCUELA TÉCNICA
// ===============================

function getBasePath() {
  return window.location.pathname.includes("/pagina/") || window.location.pathname.includes("/paginas/") ? "../" : "";
}

const usuariosPath = getBasePath() + "date/usuarios.json";

function irLogin() { window.location.href = getBasePath() + "pagina/login.html"; }
function irRegistro() { window.location.href = getBasePath() + "pagina/registrarse.html"; }
function irRegistroExterno() { window.open("https://aaferrando.com/alumno/nuevo.php", "_blank"); } // 👈 nuevo botón
function cerrarSesion() {
  localStorage.removeItem("usuarioSesion");
  localStorage.removeItem("usuarioActual");
  localStorage.removeItem("usuario");
  localStorage.removeItem("fotoPerfil");
  window.location.href = getBasePath() + "index.html";
}

async function obtenerUsuarios() {
  try {
    const res = await fetch(usuariosPath);
    if (!res.ok) throw new Error("No se pudo cargar usuarios.json: " + res.status);
    return await res.json();
  } catch (error) {
    console.warn("obtenerUsuarios: fallo al cargar usuarios.json ->", error);
    return null;
  }
}

function leerSesionNormalizada() {
  const claves = ["usuarioSesion", "usuarioActual", "usuario"];
  let raw = null, sesion = null;

  for (const k of claves) {
    raw = localStorage.getItem(k);
    if (raw) {
      try { sesion = JSON.parse(raw); } catch (e) { sesion = { nombre: raw }; }
      try {
        localStorage.setItem("usuarioSesion", JSON.stringify(sesion));
        localStorage.setItem("usuarioActual", JSON.stringify(sesion));
        if (sesion.nombre) localStorage.setItem("usuario", sesion.nombre);
      } catch (e) { console.warn("No se pudo normalizar sesión:", e); }
      return sesion;
    }
  }
  return null;
}

async function actualizarNav() {
  const nav = document.getElementById("navPrincipal");
  if (!nav) return;

  nav.innerHTML = "";

  // ===============================
  // BOTONES FIJOS DEL NAV
  // ===============================
  const bibliotecaBtn = document.createElement("a");
  bibliotecaBtn.textContent =  "📖 Biblioteca Escolar";
  bibliotecaBtn.href = "https://sites.google.com/eest5.com/bibliotecadigital";
  bibliotecaBtn.target = "_blank";
  bibliotecaBtn.classList.add("nav-link");

  const contactoBtn = document.createElement("a");
  contactoBtn.textContent = "✉️ Contacto";
  contactoBtn.href = getBasePath() + "pagina/contacto.html";
  contactoBtn.classList.add("nav-link");

  // ✅ Nuevo botón de registro externo
  const registroExternoBtn = document.createElement("a");
  registroExternoBtn.textContent = "📝 pre-inscripcion";
  registroExternoBtn.href = "pagina/nuevo.php.html";
  registroExternoBtn.target = "_blank";
  registroExternoBtn.classList.add("nav-link");

  // Agregarlos al navbar
  nav.appendChild(bibliotecaBtn);
  nav.appendChild(contactoBtn);
  nav.appendChild(registroExternoBtn);


  const sesion = leerSesionNormalizada();
  const usuarios = await obtenerUsuarios();

  if (sesion && (sesion.email || sesion.nombre)) {
    let usuario = null;
    if (Array.isArray(usuarios)) {
      usuario = usuarios.find(u =>
        (u.correo && sesion.email && u.correo.toLowerCase() === sesion.email.toLowerCase()) ||
        (u.nombre && sesion.nombre && u.nombre === sesion.nombre)
      );
    }
    if (!usuario) {
      usuario = {
        nombre: sesion.nombre || (sesion.email ? sesion.email.split("@")[0] : "Usuario"),
        correo: sesion.email || "",
        rol: sesion.rol || "usuario",
      };
    }

    const userContainer = document.createElement("div");
    userContainer.classList.add("user-container");

    const userBtn = document.createElement("button");
    userBtn.textContent = usuario.nombre;
    userBtn.classList.add("user-btn");

    const dropdown = document.createElement("div");
    dropdown.classList.add("user-menu");

    if (usuario.rol === "admin") {
      const panelAdmin = document.createElement("a");
      panelAdmin.textContent = "🛠️ Panel Admin";
      panelAdmin.href = getBasePath() + "pagina/panel_admin.html";
      dropdown.appendChild(panelAdmin);
    } else if (usuario.rol === "escritor") {
      const panelEscritor = document.createElement("a");
      panelEscritor.textContent = "📰 Panel Escritor";
      panelEscritor.href = getBasePath() + "pagina/panel_escritor.html";
      dropdown.appendChild(panelEscritor);
    }

    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "🚪 Cerrar sesión";
    logoutBtn.onclick = cerrarSesion;
    dropdown.appendChild(logoutBtn);

    userBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });
    window.addEventListener("click", () => dropdown.classList.remove("show"));

    userContainer.appendChild(userBtn);
    userContainer.appendChild(dropdown);
    nav.appendChild(userContainer);

  } else {
    // ===============================
    // Botones para usuarios no logueados
    // ===============================
    const loginBtn = document.createElement("button");
    loginBtn.textContent = "Iniciar sesión";
    loginBtn.classList.add("btn-login");
    loginBtn.addEventListener("click", irLogin);
    nav.appendChild(loginBtn);

    const registroBtn = document.createElement("button");
    registroBtn.textContent = "Registrarse";
    registroBtn.classList.add("btn-registrarse");
    registroBtn.addEventListener("click", irRegistro);
    nav.appendChild(registroBtn);
  }
}

// =======================
// Buscador simple con autocompletado (solo index.html)
// =======================
function inicializarBuscador() {
  const btn = document.getElementById("btnBuscar");
  const input = document.getElementById("buscarNoticias");
  const cont = document.querySelector(".buscador");

  if (!window.location.pathname.endsWith("index.html")) {
    if (btn) btn.style.display = "none";
    if (input) input.style.display = "none";
    if (cont) cont.style.display = "none";
    return;
  }

  cont.style.position = "relative";

  // ===============================
  // AUTOCOMPLETADO DE ESCRITORES
  // ===============================
  const sugerenciasDiv = document.createElement("div");
  sugerenciasDiv.id = "sugerencias-escritor";
  sugerenciasDiv.classList.add("sugerencias");
  sugerenciasDiv.style.position = "absolute";
  sugerenciasDiv.style.top = "35px";
  sugerenciasDiv.style.left = "0";
  sugerenciasDiv.style.width = "100%";
  sugerenciasDiv.style.display = "none";
  cont.appendChild(sugerenciasDiv);

  let escritores = [];

  // Cargar escritores únicos desde noticias.json
  fetch(getBasePath() + "date/noticias.json", { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      escritores = [...new Set(data.map(n => (n.escritor || "").trim()))].filter(Boolean);
    })
    .catch(err => console.warn("Error al cargar escritores:", err));

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase().trim();
    sugerenciasDiv.innerHTML = "";

    if (!val) {
      sugerenciasDiv.style.display = "none";
      return;
    }

    const sugerencias = escritores.filter(n => n.toLowerCase().includes(val)).slice(0, 5);

    sugerencias.forEach(nombre => {
      const div = document.createElement("div");
      div.className = "sugerencia-item";
      div.textContent = nombre;
      div.addEventListener("click", () => {
        input.value = nombre;
        sugerenciasDiv.innerHTML = "";
        sugerenciasDiv.style.display = "none";

        // Redirigir a busqueda.html con el filtro aplicado
        const params = new URLSearchParams({ escritor: nombre });
        window.location.href = getBasePath() + "pagina/busqueda.html?" + params.toString();
      });
      sugerenciasDiv.appendChild(div);
    });

    sugerenciasDiv.style.display = sugerencias.length ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!sugerenciasDiv.contains(e.target) && e.target !== input) {
      sugerenciasDiv.style.display = "none";
    }
  });

  // ===============================
  // BUSCAR AL PRESIONAR ENTER O BOTON
  // ===============================
  function aplicarBusqueda() {
    const query = input.value.trim();
    if (!query) return;
    const params = new URLSearchParams({ query });
    window.location.href = getBasePath() + "pagina/busqueda.html?" + params.toString();
  }

  if (btn) btn.addEventListener("click", aplicarBusqueda);
  input.addEventListener("keypress", (e) => { if (e.key === "Enter") aplicarBusqueda(); });
}

// =======================
document.addEventListener("DOMContentLoaded", () => {
  actualizarNav();
  inicializarBuscador();
});
