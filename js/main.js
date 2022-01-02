"use strict";

// CONSTANTES
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
// Donde se pintan las favoritas
const listFav = document.querySelector(".js-favListCompleted");


// VARIABLES
let series = [];
let favorites = [];


// AL ARRANCAR LA PÁGINA
function handleSearch() {
  apiRequest(searchText.value);
}

// OBTENER LAS SERIES DEL API
function apiRequest(userSearch) {
    fetch("//api.jikan.moe/v3/search/anime?q=naruto" + userSearch) 
      .then(response => response.json()) 
      .then(data => {
          console.log(data);
        const seriesList = data;
        // 3º GUARDAR LAS SERIES EN UN ARRAY
        series = [];
        for (const serie of seriesList) {
          series.push(serie.show);
        }
        paintSeries();
      });
    }

// PINTAR LAS SERIES
function paintSeries() {
    // Lo que vamos a rellenar
    listSeries.innerHTML = "";
    let html = "";
    let favClass = "";
    // Bucle: que recorra las series del API
    for (const serie of series) {
      const isFav = isFavorite(serie);
      if (isFav) {
        favClass = "serie--favorite";
      } else {
        favClass = "";
      }
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

// ???
function isFavorite(idSerie) {
    // el find devolverá undefined si la serie no está en el array de favoritas
    const favoriteFound = favorites.find((idFavorite) => {
        // el return dirá si la serie está o no en favoritas
      return idFavorite.id === idSerie.id;
    });
    if (favoriteFound === undefined) {
      // return dirá false cuando la serie no esté en favoritas
      return false;
    } else {
      // return dirá true cuando la serie sí esté en favoritas
      return true;
    }
  }

// ESCUCHAR EVENTOS EN LAS SERIES
function listenClickSeries() {
    const seriesCards = document.querySelectorAll(".js-searchResult_elem");
    for (const serieCard of seriesCards)
      serieCard.addEventListener("click", addFavorites);
  }


  // ???
function addFavorites(ev) {
    // Sacar id de la serie seleccionada
    const serieSelected = parseInt(ev.currentTarget.id);
    // Encontrar el id de la serie seleccionada entre las id de favoritas
    const serieClicked = series.find((idSerie) => {
      return idSerie.id === serieSelected;
    });
    const favAlready = favorites.findIndex((idFavorite) => {
      return idFavorite.id === serieSelected;
    });
  // Agregar serie
    if (favAlready === -1) {
      favorites.push(serieClicked);
    } else {
      favorites.splice(favAlready, 1);
    }
    paintSeries();
    paintFavorites();
  }

// PINTAR LAS SERIES FAVORITAS
function paintFavorites() {
    // Lo que vamos a rellenar
    listFav.innerHTML = "";
    let htmlFav = "";
   // Bucle: que recorra las series de favoritas
    for (const serie of favorites) {
      htmlFav = `<li id=${serie.id} class="fav_section-list js-favSectionList">`;
      htmlFav += `<button id="${serie.id}" class="js-deleteCross fav_elem-delete ">x</button>`;
      // Si la serie favorita no tiene imagen
      if (null === serie.image) {
        htmlFav += `<img class="fav_elem-img"
            src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV" 
            title=${serie.name} alt=${serie.name}/>`;
      } else {
          // Si la serie favorita tiene imagen
        htmlFav += `<img class="fav_elem-img"
            src=${serie.image.medium}
            title=${serie.name} alt=${serie.name}/>`;
      }
      htmlFav += `<h4 class="fav_elem-serieTitle"> ${serie.name}</h4>`;
      htmlFav += `</li>`;
      listFav.innerHTML += htmlFav;
  
      listenClickedFavorites();
    }
  }

  // ESCUCHAR EVENTOS EN LAS SERIES FAVORITAS
function listenClickedFavorites() {
    const favCards = document.querySelectorAll(".js-deleteCross");
    for (const favCard of favCards) favCard.addEventListener("click", deleteFav);
  }
  
  function deleteFav(ev) {
    const favClicked = parseInt(ev.currentTarget.id);
    const favSelected = favorites.findIndex((idFav) => idFav.id === favClicked);
    favorites.splice(favSelected, 1);
    paintSeries();
    paintFavorites();
  }
  
  function favHidden() {
    const favSection = document.querySelector(".js-favArea");
    if ((favSection.innerHTML = "")) {
      favSection.classList.add("js-hidden");
    } else {
      favSection.classList.remove("js-hidden");
    }
  }
  
  // // preventDefault para evitar que la página se recargue involuntariamente
function handleForm(ev) {
    ev.preventDefault();
  }
  
  // EVENTOS 
  // Cuando se pulsa el botón de buscar:
  searchButton.addEventListener("click", handleSearch);
  // Cuando se pulsa sobre alguna serie:
  requestPanel.addEventListener("submit", handleForm);
  //Cuando se pulsa sobre el botón de reset: resetButton.addEventListener("click", handleReset);

  //FALTA LO DEL LOCALSTORAGE!!!: guardar favoritas en el localstorage y borrarlas con el botón de reset.