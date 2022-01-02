"use strict";

// Constantes
// Input, donde meten la búsqueda
const searchText = document.querySelector(".js_formInput");
// Botón de buscar
const searchButton = document.querySelector(".js-formButton");
// Botón de reset
const resetButton = document.querySelector("js-resetButton");
// Donde se pintan las series
const listSeries = document.querySelector(".js-searchResult");
// Zona de búsqueda, el form
const requestPanel = document.querySelector(".js-form");
// Donde se pintan los favoritos
const listFav = document.querySelector(".js-favListCompleted");


// Variables
let series = [];
let favorites = [];


// Función para la búsqueda
function handleSearch() {
  apiRequest(searchText.value);
}

// Función para obtener los datos del API, fetch
function apiRequest(userSearch) {
    fetch("//api.jikan.moe/v3/search/anime?q=naruto" + userSearch) //sin http
      .then(response => response.json()) //nos pasa todo en crudo
      .then(data => {
          console.log(data);
        const seriesList = data;
        series = [];
        for (const serie of seriesList) {
          series.push(serie.show);
        }
        paintSeries();
      });
    }

// preventDefault para evitar que la página se recargue involuntariamente
function handleForm(ev) {
    ev.preventDefault();
  }

// Pintar las series

// OK plasmar series
function paintSeries() {
    // Lo que vamos a rellenar
    listSeries.innerHTML = "";
    let html = "";
    let favClass = "";
    // Que recorra las series
    for (const serie of series) {
      const isFav = isFavorite(serie);
      // Si la serie es favorita...
      if (isFav) {
        favClass = "serie--favorite";
      } else {
        favClass = "";
      }
      // Si es favorita, que aparezca listada
      html = `<li id=${serie.id} class= "searchResult_elem js-searchResult_elem ${favClass}">`;
      // Si la serie no tiene imagen
      if (null === serie.image) {
        html += `<img class="searchResult_elem-img" 
          src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
          title=${serie.name} alt=${serie.name}/>`;
      } else {
          // Si tiene, que se muestre su imagen correspondiente
        html += `<img class="searchResult_elem-img"
          src=${serie.image.medium}
          title=${serie.name} alt=${serie.name}/>`;
      }
      // Que se muestre el título
      html += `<h3>${serie.name}</h3>`;
      html += `</li>`;
      listSeries.innerHTML += html;
      listenClickSeries();
    }
  }

//// Escuchar cada serie
function listenClickSeries() {
    const seriesCards = document.querySelectorAll(".js-searchResult_elem");
    for (const serieCard of seriesCards)
      serieCard.addEventListener("click", addFavorites);
  }