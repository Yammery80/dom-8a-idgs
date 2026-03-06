'use strict';

// Declaración de utilidade s y referencias
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const buildCard =({title, text, tags}) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.dataset.tags = tags;
    article.innerHTML = `
    <h3 class="card-title"></h3>
    <p class="card-text"></p>
    <div class="card-actions">
        <button class="btn small" type="button" data-action="like">👍 Like</button>
        <button class="btn small ghost" type="button" data-action="remove">Eliminar</button>
        <span class="badge" aria-label="likes">0</span>
    </div>
    `;
    article.querySelector('.card-title').textContent = title;
    article.querySelector('.card-text').textContent = text;
    return article;
};

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
    const article = buildCard({
        title: 'Nueva Card',
        text: 'Esta card fue agregada dinámicamente al DOM usando JavaScript.',
        tags: 'nueva, dinamica'
    });

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

//const likeButtons = document.querySelectorAll('#listaArticulos button[data-action="like"]');


const listaArticulos3 = $('#listaArticulos');

listaArticulos3.addEventListener('click', (e) => {
     //¿Se hizo click en el boton de like?
    const btn = e.target.closest('button[data-action="like"]');
    if (!btn) return; //No es un boton de like, salir
    const card = btn.closest('.card');
    if (!card) return; //No se encontro el card, salir
    hacerLike(card);
});

listaArticulos3.addEventListener('click', (e) => {
   // Botón REMOVE
    const removeBtn = e.target.closest('button[data-action="remove"]');
    if (removeBtn) {
        const card = removeBtn.closest('.card');
        if (!card) return;
        quitarLike(card);
    }
});

// likeButtons.forEach(btn => {
// btn.addEventListener('click', (e) => {
//     const card = btn.closest('.card');
//     hacerLike(card);
// });

 const hacerLike = (card) => {
     const badge = card.querySelector('.badge');
     const currentLikes = Number(badge.textContent) || 0;
     badge.textContent = currentLikes + 1;
     setEstado('Like agregado');
 };
 
 const quitarLike = (card) => {
    const badge = card.querySelector('.badge');
    const currentLikes = Number(badge.textContent) || 0;

    if (currentLikes > 0) {
        badge.textContent = currentLikes - 1;
        setEstado('Like eliminado');
    } else {
        setEstado('No se puede bajar de 0 likes');
    }
};


//Filtrar cards

const filtro = $('#filtro');

const filterState = {q: '', tag: ''};

//Unir titulo y texto de cada card
//Busca lo que el usuario escribe en el filtro

const matchText = (card, q) =>{
    const title = card.querySelector('.card-title')?.textContent ?? '';
    const text = card.querySelector('.card-text')?.textContent ?? ''; 
    const haystack = (title + ' ' + text).toLowerCase();//convierte a minusculas
    return haystack.includes(q);
};

const matchTag = (card, tag) => {
    if (!tag) return true; // Si no hay tag, coinciden todas las cards
    const tags = (card.dataset.tags || '').toLowerCase();
    return tags.includes(tag.toLowerCase());
};

const applyFilters = () => {
    const cards = $$('#listaArticulos .card');
    cards.forEach((card) => {
        const okText = filterState.q 
            ? matchText(card, filterState.q) 
            : true;
        const okTag = matchTag(card, filterState.tag);
        card.hidden = !(okText && okTag);
    });
    const parts =[];
    if (filterState.q) parts.push(`Texto: "${filterState.q}"`);
    if (filterState.tag) parts.push(`Tag: "${filterState.tag}"`);
    setEstado(parts.length  
        ? `Filtros aplicados (${parts.join(', ')})` 
        : 'Filtro vacío');
};  

//Evento Input = Filtrar mientras escribe
filtro.addEventListener('input', ()=>{
    //q: lo que el usuario escribe en el input
    const q = filtro.value.trim().toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const ok = q === '' ? true : matchText(card, q);
        card.style.display = ok ? '' : 'none';
    });
    setEstado( q === '' ? 'Filtro vacío' : `Filtro texto: "${q}"`);
});

//Filtrar por tags 
const chips = $('#chips');
chips.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if(!chip) return; //No se hizo click en una chip, salir

    const tag = (chip.dataset.tag || '').toLowerCase();
    const cards = $$('#listaArticulos .card');

    cards.forEach((card) => {
        const tags = (card.dataset.tags || '').toLowerCase();
        card.hidden = !tags.includes(tag);
    });
    setEstado(`Filtro por tag: "${tag}"`);
});

// Validar el formulario de suscripción
const form = $('#formNewsletter');
const email = $('#email');
const interes = $('#interes');
const feedback = $('#feedback');

// validar el email con una expresión regular simple
const isValidEmail = (value) => /^[^\s@]+@+[^\s@]+\.[^\s@]+$/.test(value);  

form.addEventListener('submit', (e) => { 
    // Evitar el envío del formulario
    e.preventDefault(); 
    const valueEmail = email.value.trim();
    const valueInteres = interes.value.trim();

    email.classList.remove('is-invalid');
    interes.classList.remove('is-invalid');
    feedback.textContent = '';

    let ok = true;

    if (!isValidEmail(valueEmail)) {
        email.classList.add('is-invalid');
        ok = false;
    }

    if (!valueInteres) {
        interes.classList.add('is-invalid');
        ok = false;
    }

    if (!ok) {
        feedback.textContent = 'Revisa los campos marcados como inválidos.';
        setEstado('Formulario con datos no válidos');
        return;
    }
});

// Simulación de carga asíncrona de noticias

const listaNoticias = $('#listaNoticias');

const renderNoticias = (items) => {
    listaNoticias.innerHTML = '';

    if ( !items || items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No se encontraron noticias.';
        listaNoticias.append(li);
        return;
    }

    items.forEach((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        listaNoticias.append(li);
    });
 };

 //Simular una carga asincrona con setTimeOut
 //Fake fetch: #Falsa fetch que recupera información
 const fakeFetchNoticias = () => {
    return new Promise( (resolve, reject) => {
        const shouldFail = Math.random() < 0.2; //20% de probabilidad de fallo
        setTimeout(() => {
            if (shouldFail){
                reject( new Error('Fallo de red simulado'));
                return;
            }
            resolve([
                'JavaScript sigue siendo el rey de la web',
                'Estalla la tercera guerra mmundial',
                'Murio el Mencho por una Lady'
            ]);
        }, 1500);

    })
 };

 const btnCargar = $('#btnCargar');
 btnCargar.addEventListener('click', async() => {
    btnCargar.disabled = true;
    setEstado('Cargando noticias...');
    try{
        const items = await fakeFetchNoticias();
        renderNoticias(items);
        setEstado('Noticias cargadas');
    }
    catch (error){
        renderNoticias([`Error: ${error.message}`]);
        setEstado('Error al cargar noticias');
    }finally {
        btnCargar.disabled = false;
    }
 });