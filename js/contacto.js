document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formContacto');
  const btn = document.getElementById('btnEnviarContacto');
  if (!form || !btn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      alert('Debes iniciar sesión con tu cuenta para enviar el mensaje.');
      return;
    }

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      alert('Completa nombre, correo y mensaje.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const res = await fetch('../php/send_contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, mensaje, usuarioLogueado: usuario })
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const err = (data && data.error) || 'Error inesperado';
        alert('No se pudo enviar: ' + err);
      } else {
        alert('Mensaje enviado correctamente.');
        form.reset();
      }
    } catch (e) {
      alert('No se pudo enviar (error de red).');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar';
    }
  });
});


