document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formContacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const usuario = localStorage.getItem('usuario');
        if (!usuario) {
            alert('Debes iniciar sesión para enviar el mensaje.');
            return;
        }

        const datos = new FormData(form);
        // Adjuntar el usuario logueado
        datos.append('usuarioLogueado', usuario);

        fetch('../php/enviar.php', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || (data.ok ? 'Mensaje enviado' : 'No se pudo enviar'));
            if (data.ok) form.reset();
        })
        .catch(() => {
            alert('Error al enviar el mensaje');
        });
    });
});


