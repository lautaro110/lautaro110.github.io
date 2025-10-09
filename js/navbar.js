// ...existing code...
document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbarContainer");
    if (!navbarContainer) return;

    navbarContainer.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Web Escolar</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarContent">
                    <form class="d-flex mx-auto" role="search">
                        <input class="form-control" type="search" placeholder="Buscar noticias..." id="searchInput">
                    </form>
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item me-2">
                            <button id="googleLoginBtn" class="btn btn-outline-primary d-flex align-items-center">
                                <img id="googleUserImg" src="img/user-empty.png" alt="usuario" class="rounded-circle me-2" width="30" height="30">
                                <span id="html/login.html">Iniciar sesión</span>
                            </button>
                        </li>
                        <li class="nav-item me-2">
                            <button id="inscribirseBtn" class="btn btn-success">Inscribirse</button>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="html/contacto.html">Contacto</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;

    // Delegación de eventos: maneja clicks de botones del navbar
    navbarContainer.addEventListener('click', function (evt) {
        const btn = evt.target.closest('button, a');
        if (!btn) return;

        if (btn.id === 'googleLoginBtn') {
            evt.preventDefault();
            // Aquí llama a tu flujo de login. Ejemplo:
            // window.location.href = '/php/login.php';
            console.log('Google login clicked');
            return;
        }

        if (btn.id === 'inscribirseBtn') {
            evt.preventDefault();
            // Lógica de inscripción (abrir modal, redirigir, etc.)
            console.log('Inscribirse clicked');
            return;
        }

        // Ejemplo: si quieres interceptar el enlace de Contacto
        if (btn.matches('a.nav-link[href="html/contacto.html"]')) {
            // Si no quieres recargar, evita el default y carga contenido dinámico
            // evt.preventDefault();
            // cargarContacto();
            console.log('Contacto clicked');
            return;
        }
    });

    // Login dinámico Google
    function updateGoogleButton(user) {
        const img = document.getElementById('googleUserImg');
        const name = document.getElementById('googleUserName');
        if (!img || !name) return;
        if (user && user.picture) {
            img.src = user.picture;
        } else {
            img.src = "img/user-empty.png";
        }
        name.textContent = (user && user.name) ? user.name : "Iniciar sesión";
    }

    fetch('php/session_info.php')
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) updateGoogleButton(data.user);
        })
        .catch(err => console.log('No logueado', err));
});
// ...existing code...