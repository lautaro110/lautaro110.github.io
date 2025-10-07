document.addEventListener('DOMContentLoaded', ()=>{
    actualizarNav();
    const index = localStorage.getItem('noticiaActual');
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');
    if(index === null || !noticias[index]) return;

    const n = noticias[index];
    const cont = document.getElementById('noticiaCompleta');
    cont.innerHTML = `
        <h2>${n.titulo}</h2>
        ${n.imagen ? `<img src="${n.imagen}" style="width:100%; max-height:400px; object-fit:cover;">` : ''}
        <p>${n.contenido}</p>
        <small>Publicado: ${n.fecha}</small>
    `;
});
