document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRegistro");
  const inputs = {
    correo: document.getElementById("correo"),
    nombre: document.getElementById("nombre"),
    password: document.getElementById("password"),
    confirmar: document.getElementById("confirmar")
  };

  let tipoCuenta = "manual"; 
  let datosGoogle = null;    

  // =====================
  // Mostrar y limpiar errores
  // =====================
  const mostrarError = (input, mensaje) => {
    const small = input.parentElement.querySelector(".error");
    if (small) {
      small.innerText = mensaje;
      small.style.display = "block";
    }
    input.style.borderColor = "#d93025";
  };

  const limpiarError = (input) => {
    const small = input.parentElement.querySelector(".error");
    if (small) {
      small.innerText = "";
      small.style.display = "none";
    }
    input.style.borderColor = "#ccc";
  };

  // =====================
  // Envío del formulario
  // =====================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valido = true;
    Object.values(inputs).forEach(limpiarError);

    if (tipoCuenta === "manual") {
      if (!inputs.correo.value.trim()) { mostrarError(inputs.correo,"El correo es obligatorio"); valido=false; }
      if (!inputs.nombre.value.trim()) { mostrarError(inputs.nombre,"El nombre completo es obligatorio"); valido=false; }
      if (inputs.password.value.length < 6) { mostrarError(inputs.password,"La contraseña debe tener al menos 6 caracteres"); valido=false; }
      if (inputs.confirmar.value !== inputs.password.value) { mostrarError(inputs.confirmar,"Las contraseñas no coinciden"); valido=false; }
      if (!valido) return;
    }

    const datos = (tipoCuenta === "google")
      ? { nombre: datosGoogle.name, correo: datosGoogle.email, contraseña:"", tipoCuenta:"google" }
      : { nombre: inputs.nombre.value.trim(), correo:inputs.correo.value.trim(), contraseña:inputs.password.value, tipoCuenta:"manual" };

    try {
      const response = await fetch("../php/loginphp/registrar_usuario.php", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if(result.success){
        localStorage.setItem("usuarioActual",JSON.stringify(result.usuario));
        window.location.href="../index.html";
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al conectar con el servidor.");
    }
  });

  // =====================
  // Login con Google
  // =====================
  window.handleCredentialResponse = function(response){
    const data = parseJwt(response.credential);
    tipoCuenta = "google";
    datosGoogle = {email:data.email,name:data.name};
    inputs.correo.value = data.email;
    inputs.nombre.value = data.name;
    form.requestSubmit();
  };

  function parseJwt(token){
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g,"+").replace(/_/g,"/");
    let jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00"+c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    return JSON.parse(jsonPayload);
  }

  // =====================
  // Ojito con línea que pasa (mostrar/ocultar contraseña)
  // =====================
  const toggleButtons = document.querySelectorAll(".toggle-password");
  toggleButtons.forEach(toggle => {
    const input = toggle.parentElement.querySelector("input");
    const eyeOpen = toggle.querySelector(".eye-open");
    const eyeClosed = toggle.querySelector(".eye-closed");

    toggle.addEventListener("click", () => {
      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");

      if (isPassword) {
        eyeOpen.style.opacity = "0";
        eyeClosed.style.opacity = "1";
      } else {
        eyeOpen.style.opacity = "1";
        eyeClosed.style.opacity = "0";
      }
    });
  });
});
