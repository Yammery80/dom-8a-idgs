'use strict';

// Declaración de utilidades y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const estadoUI = $('#estadoUI');
const setEstado = (msg) => { estadoUI.textContent = msg; };
setEstado('Listo');

const btnCambiar = $('#btnCambiarMensaje');
const titulo = $('#tituloPrincipal');
const subtitulo = $('#subtituloPrincipal');

//Manejador del evento click del botón

btnCambiar.addEventListener('click', () => {
    const alt = titulo.dataset.alt === '1';

    titulo.textContent = alt
        ? 'Haz sido trolleado por JavaScript'
        : 'Bienvenido a la aplicación de ejemplo';
        
    subtitulo.textContent = alt
        ? '¡Sorpresa!, este es un mensaje alternativo'
        : 'Este es una aplicacion sencilla para demostrar la manipulación del DOM con JavaScript';
    titulo.dataset.alt = alt ? '1' : '0';
    setEstado('Textos actualizados');

 });

