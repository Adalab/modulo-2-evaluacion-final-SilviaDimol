"use strict";

// CONSTANTES
// Input, donde meten la búsqueda
const searchInput = document.querySelector(".js-formInput");
// Botón de buscar
const searchButton = document.querySelector(".js-searchButton");
// Botón de reset del input
const resetButton = document.querySelector(".js-resetButton");
// Botón de reset de favoritas
const resetFavoritesButton = document.querySelector(".js-resetFavoritesButton");
// Donde se pintan las series
const seriesList = document.querySelector(".js-seriesList");
// Zona de búsqueda, el form,------------------------------------------------------ ESTO LO VOY A USAR?
const requestPanel = document.querySelector(".js-form");
// Donde se pintan las favoritas
const favoriteSeriesList = document.querySelector(".js-favoriteSeriesList");

// VARIABLES GLOBALES
let allData;

// BOTÓN DE BUSCAR
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
   // Por si el array que guarda los datos no existe, creamos uno vacío para que no de error el bucle 
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

// LOCAL STORAGE
// Array donde se van a guardar los datos de mi favoritos (local storage)
let allDataFavorites = JSON.parse(localStorage.getItem('allDataFavorites'));
if (allDataFavorites === null) {
  allDataFavorites = [];
}
// Función para guardar los favoritos en el local storage
function addFavorite(event) {
  //Con push metemos un elemento en el array, y en el array vacío AllDataFavorites, lo que vamos a guardar son esos atributos que le dimos al li: id, title e image (para poder pintarlo luego). Con event.currenttarget haces referencia a la serie concreta donde estás clicando, así guardar el dat.set de eso
  allDataFavorites.push(event.currentTarget.dataset);
  // Ahora, esos datos que has guardado en el array, se los mandas al local storage
  console.log(event.currentTarget);
  localStorage.setItem('allDataFavorites', JSON.stringify(allDataFavorites));
  // Voy añadirle una clase para luego poder subrayarlo con css, en plan seleccionada
  event.currentTarget.classList.add('selectedFavoriteSerie');
  // Para que me pinte también las series favos
  paintFavoriteSeries(allDataFavorites);
}

paintFavoriteSeries(allDataFavorites);
// PINTAR LAS SERIES FAVORITAS
function paintFavoriteSeries(allDataFavorites) {
  favoriteSeriesList.innerHTML = '';
   // Para recorrer el array con todos los datos, creo un bucle for of (DOM)
   for (const eachFavoriteSerie of allDataFavorites) {
    const favoriteSerie = document.createElement('li');
    const favoriteSerieTitle = document.createTextNode(eachFavoriteSerie.title);
    const favoriteSerieImage = document.createElement('img');
    favoriteSerieImage.setAttribute('src', eachFavoriteSerie.image);
    // Ahora le digo qué lugar quiero que ocupen en el html (hijos de)
    favoriteSeriesList.appendChild(favoriteSerie);
    favoriteSerie.appendChild(favoriteSerieTitle);
    favoriteSerie.appendChild(favoriteSerieImage);
    // Aqui le añado una clase al li para poder darle estilos en css
    serie.classList.add('favoriteSerie');
   }
  }

// BOTÓN BORRAR (borrar búsqueda)
resetButton.addEventListener('click', deleteInput);
function deleteInput() {
  location.reload();
}

// BOTÓN PAPELERA (borrar favoritas)
resetFavoritesButton.addEventListener('click', deleteFavorites);
function deleteFavorites() {
  localStorage.setItem('allDataFavorites', '[]');
  allDataFavorites = [];
  favoriteSeriesList.innerHTML ='';

}