document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLogin");
  const inputs = {
    correo: document.getElementById("correo"),
    password: document.getElementById("password")
  };

  // =====================
  // Funciones de error
  // =====================
  function limpiarErrores() {
    const mensaje = document.getElementById("mensaje");
    if (mensaje) {
      mensaje.textContent = "";
      mensaje.style.display = "none";
      mensaje.className = "mensaje";
    }

    Object.values(inputs).forEach(input => {
      const small = input.parentElement.querySelector(".error");
      if (small) {
        small.innerText = "";
        small.style.display = "none";
      }
      input.classList.remove("error-input");
    });
  }

  function mostrarMensaje(texto, tipo = "error") {
    const mensaje = document.getElementById("mensaje");
    if (!mensaje) return;
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = "block";
  }

  function mostrarErrorCampo(input, texto) {
    const small = input.parentElement.querySelector(".error");
    if (small) {
      small.innerText = texto;
      small.style.display = "block";
    }
    input.classList.add("error-input");
  }

  // =====================
  // Función JWT Google
  // =====================
  function parseJwt(token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(atob(base64).split("").map(c =>
      "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(""));
    return JSON.parse(jsonPayload);
  }

  // =====================
  // LOGIN MANUAL
  // =====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    limpiarErrores();

    const correo = inputs.correo.value.trim();
    const password = inputs.password.value.trim();

    if (!correo) return mostrarErrorCampo(inputs.correo, "El correo es obligatorio");
    if (!password) return mostrarErrorCampo(inputs.password, "La contraseña es obligatoria");

    try {
      const res = await fetch("../date/usuarios.json");
      const usuarios = await res.json();
      const usuario = usuarios.find(u =>
        u.correo.toLowerCase() === correo.toLowerCase() &&
        u.contraseña === password
      );

      if (usuario) {
        localStorage.setItem("usuarioSesion", JSON.stringify(usuario));
        if (usuario.foto) localStorage.setItem("fotoPerfil", usuario.foto);
        mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", "ok");
        setTimeout(() => window.location.href = "../index.html", 1500);
      } else {
        mostrarMensaje("Correo o contraseña incorrectos.", "error");
      }
    } catch (error) {
      mostrarMensaje("Error al conectar con el servidor.", "error");
      console.error(error);
    }
  });

  // =====================
  // LOGIN CON GOOGLE
  // =====================
  window.handleCredentialResponse = async function (response) {
    const data = parseJwt(response.credential);
    const correo = data.email;

    try {
      const res = await fetch("../date/usuarios.json");
      const usuarios = await res.json();
      const usuario = usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase());

      if (usuario) {
        localStorage.setItem("usuarioSesion", JSON.stringify(usuario));
        if (usuario.foto) localStorage.setItem("fotoPerfil", usuario.foto);
        mostrarMensaje("Inicio de sesión con Google exitoso.", "ok");
        setTimeout(() => window.location.href = "../index.html", 1500);
      } else {
        mostrarMensaje("No existe una cuenta vinculada a este Google.", "error");
      }
    } catch (error) {
      mostrarMensaje("Error al verificar la cuenta de Google.", "error");
      console.error(error);
    }
  };

  // =====================
  // VER / OCULTAR CONTRASEÑA (solo tacha la línea)
  // =====================
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    const passwordInput = document.getElementById("password");
    const eyeOpen = togglePassword.querySelector(".eye-open");
    const eyeClosed = togglePassword.querySelector(".eye-closed");

    togglePassword.addEventListener("click", () => {
      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");

      // solo cambia opacidad sin rotación
      eyeOpen.style.opacity = isPassword ? "0" : "1";
      eyeClosed.style.opacity = isPassword ? "1" : "0";
    });
  }
});
