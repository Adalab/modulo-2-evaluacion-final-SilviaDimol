"use strict";

// CONSTANTES
// Input, donde meten la búsqueda
const searchInput = document.querySelector(".js-formInput");
// Botón de buscar
const searchButton = document.querySelector(".js-searchButton");
// Botón de reset
const resetButton = document.querySelector("js-resetButton");
// Donde se pintan las series
const seriesList = document.querySelector(".js-seriesList");
// Zona de búsqueda, el form
const requestPanel = document.querySelector(".js-form");
// Donde se pintan las favoritas
const listFav = document.querySelector(".js-favListCompleted");

// VARIABLES GLOBALES
let allData;

// EVENTO INPUT Y BOTÓN DE BUSCAR
searchButton.addEventListener('click', apiRequest);

// OBTENER SERIES DEL API
function apiRequest(event) {
  event.preventDefault();
  fetch(`https://api.jikan.moe/v3/search/anime?q=${searchInput.value}`)
    .then((response) => response.json())
    .then((data) => {
      allData = data.results;
      paintSeries(allData);
    });
  }
    

// PINTAR LAS SERIES
function paintSeries(seriesData) {
  //Para limpiar y que no se sume una búsqueda a otra
  seriesList.innerHTML = '';
   // Por si el array que guarda los datos no existe, creamos uno vacío para que no de error el bucle que tiene que recorrer eses array que no existiría
  if (seriesData === null) {
     seriesData = [];}
     else {
   // Para recorrer el array con todos los datos, creo un bucle for of (DOM)
   for (const eachSerie of seriesData) {
    const serie = document.createElement('li');
    const serieTitle = document.createTextNode(eachSerie.title);
    const serieImage = document.createElement('img');
    serieImage.setAttribute('src', eachSerie.image_url);
    // Ahora le digo qué lugar quiero que ocupen en el html (hijos de)
    seriesList.appendChild(serie);
    serie.appendChild(serieTitle);
    serie.appendChild(serieImage);
    // Añadir atributos al li para guardarlo en el local storage
    serie.setAttribute('data-id', eachSerie.mal_id);
    serie.setAttribute('data-title', eachSerie.title);
    serie.setAttribute('data-image', eachSerie.image_url);
    // Aqui le añado una clase al li para poder darle estilos en css
    serie.classList.add('serie');
    // Evento para mandar series al local storage
    serie.addEventListener('click', addFavorite);
   }
  }
}

// Array donde se van a guardar los datos de mi favoritos (local storage)
let allDataFavorites = JSON.parse(localStorage.getItem('seriesInLocal'));
if (allDataFavorites === null) {
  allDataFavorites = [];
}

// Función para guardar los favoritos en el local storage
function addFavorite(event) {
  //Con push metemos un elemento en el array, y en el array vacío AllDataFavorites, lo que vamos a guardar son esos atributos que le dimos al li: id, title e image (para poder pintarlo luego). Con event.currenttarget haces referencia a la serie concreta donde estás clicando, así guardar el dat.set de eso
  allDataFavorites.push(event.currentTarget.dataset);
  // Ahora, esos datos que has guardado en el array, se los mandas al local storage
  localStorage.setItem('seriesInLocal', JSON.stringify(allDataFavorites));
  // Voy añadirle una clase para luego poder subrayarlo con css, en plan seleccionada
  event.currentTarget.classList.add('favoriteSerie');
  // Para que me pinte también las series favos
  paintFavoriteSeries(allDataSeries)
  
}
// Ahora tocaría pintar lo que he guardado en el local, que son las series favoritas, sería igual que la función d epaintSeries pero en vez de con el array que te trae el fect, con allDataFavorites (que es donde guardado los datos de las fav). Habrá que dar nombres nuevos en plan eachFavSerie. ¡! fijarme que en el ul donde lo guardas, sea el de mis favoritas y no el de resultados. 

// Para el reset, location.reload (dentro de una función que te inventes, que a su vez responde al listener del botón reset).

//Reset para mis favoritas

// Añadir otro listener para el botón borrar favoritas, mismo proceso.
