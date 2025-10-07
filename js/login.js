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
    const base = window.location.pathname.includes('/pagina/') ? '../' : '';
    window.location.href = base + 'pagina/login.html';
}

// =======================
// Función de login
// =======================
function login() { /* Deshabilitado: solo Google Sign-In */ }

// =======================
// Actualizar navbar dinámico
// =======================
function actualizarNav() {
    const nav = document.getElementById('navPrincipal');
    if (!nav) return;

    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');

    const base = window.location.pathname.includes('/pagina/') ? '../' : '';

    nav.innerHTML = '';

    const secciones = [
        {nombre: "Noticias", href: base + 'index.html'},
        {nombre: "Calendario", href: base + 'pagina/calendario.html'},
        {nombre: "Contacto", href: base + 'pagina/contacto.html'}
    ];

    secciones.forEach(sec => {
        const a = document.createElement('a');
        a.href = sec.href;
        a.textContent = sec.nombre;
        nav.appendChild(a);
    });

    if (usuario && rol === 'admin') {
        const a = document.createElement('a');
        a.href = base + 'pagina/panel_admin.html';
        a.textContent = 'Panel Admin';
        nav.appendChild(a);

        const btn = document.createElement('button');
        btn.textContent = `Cerrar sesión (${usuario})`;
        btn.onclick = cerrarSesion;
        nav.appendChild(btn);

    } else if (usuario && rol === 'escritor') {
        const a = document.createElement('a');
        a.href = base + 'pagina/panel_escritor.html';
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

// =======================
// Google Identity Services
// =======================
(function initGoogleSignIn() {
    // Evitar errores si el script de Google aún no cargó o no estamos en página de login
    if (typeof window === 'undefined') return;

    const onLoad = () => {
        const google = window.google;
        const target = document.getElementById('g_id_signin');
        if (!google || !target) return;

        // Client ID configurado desde Google Cloud Console
        const clientId = '475324951083-lp2pvqi80vs95cshsij7hn5m8tg3b0s3.apps.googleusercontent.com';

        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredential
        });
        google.accounts.id.renderButton(target, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular'
        });
        // Opcional: One Tap
        // google.accounts.id.prompt();
    };

    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
})();

function handleGoogleCredential(response) {
    try {
        // Decodificar el JWT para obtener email y nombre
        const payload = parseJwt(response.credential);
        const email = payload && payload.email;
        const name = payload && (payload.name || payload.given_name || payload.email);
        if (!email) {
            console.warn('[google] No email in credential payload');
            return;
        }

        // Mapeo simple de emails a roles locales
        const emailToRole = getEmailToRoleMap();
        const rol = emailToRole[email] || 'escritor';

        // Persistir sesión local, usando email como "usuario"
        localStorage.setItem('usuario', name || email);
        localStorage.setItem('rol', rol);

        // Redirigir según rol
        if (rol === 'admin') window.location.href = '../pagina/panel_admin.html';
        else window.location.href = '../pagina/panel_escritor.html';
    } catch (e) {
        console.error('[google] Error handling credential', e);
    }
}

function getEmailToRoleMap() {
    // Puedes editar esta lista para asignar roles a emails específicos
    return {
        'tu-admin@ejemplo.com': 'admin'
        // Agrega más: 'otro@ejemplo.com': 'escritor'
    };
}

function parseJwt(token) {
    // Decodificador ligero de JWT en el cliente
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}