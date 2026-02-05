'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtitulo');

//Manejador del evento click del botón

btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? 'Haz sido trolleado por JavaScript'
        : 'Bienvenido a la aplicación de ejemplo';

    subtitulo.textContent = alt
        ? '¡Sorpresa!, este es un mensaje alternativo'
        : 'Este es una aplicacion sencilla para demostrar la manipulación del DOM con JavaScript';
        
    titulo.dataset.alt = alt ? '0' : '1';
    setEstado('Textos actualizados');
 });
 //Manejadore del evento mouseover de los articulos
 const listaArticulos =$('#listaArticulos');
 listaArticulos.addEventListener('mouseover', (e) => { 
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.add('is-highlight');
 });

 //Manejadore del evento mouseover de los articulos
 listaArticulos.addEventListener('mouseout', (e) => { 
    const card = e.target.closest('.card');
    if (!card) return;
    card.classList.remove('is-highlight');
 });

//Agregar elementos al DOM de forma dinámica
 const btnAgregar = $('#btnAgregarCard');
 const listaArticulosDiv = $('#listaArticulos');


btnAgregarCard.addEventListener('click', () => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = 'nuevo';
    article.innerHTML = `
    <h3 class="card-title">Nueva Card: Agentes de IA</h3>
    <p class="card-text">Los agentes de IA son sistemas que pueden tomar decisiones autónomas y actuar en un entorno.</p>

    <div class="card-actions">
        <button class="btn small" type="button" data-action="like">👍 Like</button>
        <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
        <span class="badge" aria-label="likes">0</span>
    </div>
    `;

    listaArticulosDiv.prepend(article);
    setEstado('Nueva card agregada');
});
//Eliminar elementos del DOM de forma dinámica
const btnLimpiarCard = $('#btnLimpiarCards');

btnLimpiar.addEventListener('click', () => {
    const cards = $$('#listaArticulos .card');
    let removed = 0;
    cards.forEach(card => { 
        if(card.dataset.seed === 'true') return;
            card.remove();
            removed++;
     });
     setEstado(`Se eliminaron ${removed} cards`);
});
