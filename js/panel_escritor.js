function verNoticia(id) {
  // Redirige a ver_noticias.html pasando el id por query string
  window.location.href = `ver_noticia.html?id=${id}`;
}


// =======================
// PANEL ESCRITOR - Noticias
// =======================
document.addEventListener("DOMContentLoaded", () => {
  cargarNoticias();

  const form = document.getElementById("formNoticia");
  const inputImagen = document.getElementById("imagenNoticia");
  const vistaPrevia = document.getElementById("previewImagen");
  const editor = document.getElementById("editor");

  // Vista previa de imagen
  if (inputImagen && vistaPrevia) {
    inputImagen.addEventListener("change", (e) => {
      const archivo = e.target.files[0];
      if (archivo) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          vistaPrevia.src = ev.target.result;
          vistaPrevia.style.display = "block";
        };
        reader.readAsDataURL(archivo);
      } else {
        vistaPrevia.src = "";
        vistaPrevia.style.display = "none";
      }
    });
  }

  // Enviar noticia (crear o editar)
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // completar campos ocultos
      document.getElementById("fechaNoticia").value = new Date().toLocaleDateString("es-AR");
      document.getElementById("autorNoticia").value = localStorage.getItem("usuario") || "Anónimo";

      const idEditar = form.dataset.idEditar || null;
      const imagenAnterior = form.dataset.imagenAnterior || "";
      const datos = new FormData(form);
      datos.append("contenido", editor.innerHTML);

      try {
        let respuesta;

        if (idEditar) {
          // ====== MODO EDICIÓN ======
          datos.append("id", idEditar);
          datos.append("imagenAnterior", imagenAnterior);

          respuesta = await fetch("../php/noticias.php", {
            method: "POST",
            body: datos
          });

          const result = await respuesta.json();
          if (result.error) throw new Error(result.error);

          alert("✏️ Noticia actualizada correctamente");
          delete form.dataset.idEditar;
          delete form.dataset.imagenAnterior;

        } else {
          // ====== NUEVA NOTICIA ======
          respuesta = await fetch("../php/noticias.php", { method: "POST", body: datos });
          const result = await respuesta.json();
          if (result.error) throw new Error(result.error);
          alert("✅ Noticia publicada con éxito");
        }

        form.reset();
        vistaPrevia.src = "";
        vistaPrevia.style.display = "none";
        editor.innerHTML = "";
        cargarNoticias();
      } catch (err) {
        console.error(err);
        alert("❌ Error al guardar la noticia");
      }
    });
  }
});

// =======================
// Cargar todas las noticias
// =======================
async function cargarNoticias() {
  const contenedor = document.getElementById("listaNoticias");
  if (!contenedor) return;

  try {
    const res = await fetch("../php/noticias.php");
    const noticias = await res.json();

    if (!Array.isArray(noticias) || noticias.length === 0) {
      contenedor.innerHTML = "<p>No hay noticias aún.</p>";
      return;
    }

    contenedor.innerHTML = "";
    noticias.reverse().forEach((n) => {
      const card = document.createElement("div");
      card.className = "noticia-mini";

      const imgSrc = n.imagen ? `../${n.imagen}?v=${Date.now()}` : "../img/sin_imagen.png";

      card.innerHTML = `
        <img src="${imgSrc}" alt="Portada">
        <h3>${n.titulo}</h3>
        <p class="autor">${n.fecha}</p>
        <p class="contenido">${n.contenido.substring(0, 100)}...</p>
        <div class="acciones">
          <button class="btn-ver" onclick="verNoticia(${n.id})">👁️ Ver</button>
          <button class="btn-editar" onclick="editarNoticia(${n.id})">✏️ Editar</button>
          <button class="btn-eliminar" onclick="eliminarNoticia(${n.id})">🗑️ Eliminar</button>
        </div>
      `;

      contenedor.appendChild(card);
    });
  } catch (error) {
    console.error("Error al cargar noticias:", error);
  }
}

// =======================
// Eliminar noticia
// =======================
async function eliminarNoticia(id) {
  if (!confirm("¿Seguro que querés eliminar esta noticia?")) return;

  try {
    const res = await fetch("../php/noticias.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);
    alert(data.mensaje || "🗑️ Noticia eliminada");
    cargarNoticias();
  } catch (err) {
    console.error(err);
    alert("❌ Error al eliminar la noticia");
  }
}

// =======================
// Editar noticia
// =======================
async function editarNoticia(id) {
  try {
    const res = await fetch("../php/noticias.php");
    const noticias = await res.json();
    const noticia = noticias.find((n) => n.id == id);
    if (!noticia) {
      alert("Noticia no encontrada");
      return;
    }

    const form = document.getElementById("formNoticia");
    const vistaPrevia = document.getElementById("previewImagen");

    if (form) {
      form.dataset.idEditar = noticia.id;
      form.dataset.imagenAnterior = noticia.imagen || "";

      form.querySelector("#tituloNoticia").value = noticia.titulo;
      document.getElementById("editor").innerHTML = noticia.contenido;
      form.querySelector("#autorNoticia").value = noticia.autor;
      form.querySelector("#fechaNoticia").value = noticia.fecha;

      if (vistaPrevia && noticia.imagen) {
        vistaPrevia.src = `../${noticia.imagen}`;
        vistaPrevia.style.display = "block";
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (err) {
    console.error(err);
    alert("Error al editar la noticia");
  }
}

// ===============================
// 🔹 Cargar noticia a editar si viene desde panel admin
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  const idEditar = localStorage.getItem("idEditarNoticia");
  if (idEditar) {
    try {
      const res = await fetch("../php/noticias.php");
      const noticias = await res.json();
      const noticia = noticias.find(n => n.id == idEditar);

      if (noticia) {
        const form = document.getElementById("formNoticia");
        const vistaPrevia = document.getElementById("previewImagen");

        form.dataset.idEditar = noticia.id;
        form.dataset.imagenAnterior = noticia.imagen || "";
        form.querySelector("#tituloNoticia").value = noticia.titulo;
        document.getElementById("editor").innerHTML = noticia.contenido;
        form.querySelector("#autorNoticia").value = noticia.autor;
        form.querySelector("#fechaNoticia").value = noticia.fecha;

        if (vistaPrevia && noticia.imagen) {
          vistaPrevia.src = `../${noticia.imagen}`;
          vistaPrevia.style.display = "block";
        }

        // Limpia el ID del localStorage
        localStorage.removeItem("idEditarNoticia");

        window.scrollTo({ top: 0, behavior: "smooth" });
        alert("✏️ Modo edición activado desde el panel admin.");
      }
    } catch (err) {
      console.error("Error al cargar noticia desde admin:", err);
    }
  }
});
