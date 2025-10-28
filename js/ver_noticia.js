document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("noticiaContainer");
  const btnVolver = document.getElementById("btnVolver");
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  // ============================
  // BOTÓN VOLVER UNIVERSAL
  // ============================
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "../index.html";
      }
    });
  }

  // ============================
  // VALIDACIÓN DEL ID
  // ============================
  if (!id) {
    contenedor.innerHTML = "<p style='color:red;'>Error: No se especificó la noticia.</p>";
    return;
  }

  // ============================
  // CARGAR NOTICIAS
  // ============================
  try {
    const res = await fetch("../php/noticias.php", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo conectar con el servidor.");
    
    const noticias = await res.json();
    if (!Array.isArray(noticias)) throw new Error("Formato de noticias inválido.");

    const noticia = noticias.find(n => n.id == id);
    if (!noticia) {
      contenedor.innerHTML = "<p style='color:red;'>No se encontró la noticia.</p>";
      return;
    }

    const imgSrc = noticia.imagen
      ? `../${noticia.imagen}?v=${Date.now()}`
      : "../img/sin_imagen.png";

    contenedor.innerHTML = `
      <h1>${noticia.titulo}</h1>
      <p class="autor">Por ${noticia.autor} | ${noticia.fecha}</p>
      <div class="imagen-wrapper">
        <img src="${imgSrc}" alt="Portada" class="imagen-noticia">
      </div>
      <div class="contenido">${noticia.contenido}</div>
    `;

    const imagen = contenedor.querySelector(".imagen-noticia");
    if (imagen) imagen.scrollIntoView({ behavior: "smooth" });

  } catch (error) {
    console.error("Error al cargar la noticia:", error);
    contenedor.innerHTML = `<p style='color:red;'>Error al cargar la noticia: ${error.message}</p>`;
  }
});
