// =======================
// Inicializar usuarios por defecto
// =======================
if (!localStorage.getItem('usuarios')) {
    const usuariosIniciales = {
        "admin": { "usuario": "admin", "password": "admin123", "rol": "admin" },
        "escritor1": { "usuario": "escritor1", "password": "123456", "rol": "escritor" }
    };                                                                             
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
}

// =======================
// Redirigir al login
// =======================
function irLogin() {
    window.location.href = '../pagina/login.html';
}

// =======================
// Función de login
// =======================
function login() {
    const usuarioInput = document.getElementById('usuario');
    const passwordInput = document.getElementById('password');
    const mensajeError = document.getElementById('mensajeError');

    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    // Debug: log values read from inputs
    console.log('[login] usuario input:', usuario);
    console.log('[login] password input:', password ? '***hidden***' : '(empty)');

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};
    console.log('[login] usuarios in localStorage:', usuarios);
    const user = Object.values(usuarios).find(u => u.usuario === usuario && u.password === password);

    console.log('[login] user found:', user);

    if (!user) {
        mensajeError.textContent = "Usuario o contraseña incorrectos";
        return;
    }

    localStorage.setItem('usuario', user.usuario);
    localStorage.setItem('rol', user.rol);

    usuarioInput.value = '';
    passwordInput.value = '';
    mensajeError.textContent = '';

    if (user.rol === "admin") window.location.href = '../pagina/panel_admin.html';
    else if (user.rol === "escritor") window.location.href = '../pagina/panel_escritor.html';
}

// =======================
// Actualizar navbar dinámico
// =======================
function actualizarNav() {
    const nav = document.getElementById('navPrincipal');
    if (!nav) return;

    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');

    nav.innerHTML = '';

    const secciones = [
        {nombre: "Noticias", href: "../index.html"},
        {nombre: "Calendario", href: "../pagina/calendario.html"},
        {nombre: "Contacto", href: "../pagina/contacto.html"}
    ];

    secciones.forEach(sec => {
        const a = document.createElement('a');
        a.href = sec.href;
        a.textContent = sec.nombre;
        nav.appendChild(a);
    });

    if (usuario && rol === 'admin') {
        const a = document.createElement('a');
        a.href = '../pagina/panel_admin.html';
        a.textContent = 'Panel Admin';
        nav.appendChild(a);

        const btn = document.createElement('button');
        btn.textContent = `Cerrar sesión (${usuario})`;
        btn.onclick = cerrarSesion;
        nav.appendChild(btn);

    } else if (usuario && rol === 'escritor') {
        const a = document.createElement('a');
        a.href = '../pagina/panel_escritor.html';
        a.textContent = 'Panel Escritor';
        nav.appendChild(a);

        const btn = document.createElement('button');
        btn.textContent = `Cerrar sesión (${usuario})`;
        btn.onclick = cerrarSesion;
        nav.appendChild(btn);

    } else {
        const btn = document.createElement('button');
        btn.textContent = 'Iniciar sesión';
        btn.onclick = irLogin;
        nav.appendChild(btn);
    }
}

// =======================
// Cerrar sesión
// =======================
function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    actualizarNav();
}

// =======================
// Ejecutar navbar al cargar
// =======================
document.addEventListener('DOMContentLoaded', actualizarNav);
