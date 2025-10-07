function cargarNoticias() {
    fetch('../data/noticias.json')
    .then(res => res.json())
    .then(noticias => {
        const cont = document.getElementById('noticiasContainer');
        cont.innerHTML = '';
        if(noticias.length === 0) cont.innerHTML = '<p>No hay noticias disponibles.</p>';
        noticias.forEach(n=>{
            const div = document.createElement('div');
            div.className='noticia';
            div.innerHTML=`<h2>${n.titulo}</h2><small>Publicado: ${n.fecha}</small><p>${n.contenido}</p>`;
            cont.appendChild(div);
        });
    });
}

function publicarNoticia() {
    const titulo = document.getElementById('titulo').value;
    const contenido = document.getElementById('contenido').value;
    const noticias = JSON.parse(localStorage.getItem('noticias') || '[]');
    noticias.push({titulo, contenido, fecha: new Date().toLocaleString()});
    localStorage.setItem('noticias', JSON.stringify(noticias));
    alert('Noticia publicada');
    cargarNoticias();
}

document.addEventListener('DOMContentLoaded', cargarNoticias);
