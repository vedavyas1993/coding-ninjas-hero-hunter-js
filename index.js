import { tsAndHash } from "./utils/hashGenerator.js";
import {
  emptyHeart,
  fillHeart,
  handleLikeAndDislike,
} from "./utils/heartIcons.js";

let limit = 50;
let offset = 0;
let pages;
let results;
let favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));

// function to add heros list to dom
function addHeroToDOM(hero, cardsContainer) {
  let div = document.createElement("div");
  div.classList.add("col");
  div.innerHTML = `
            <div class="card h-100 bg-dark position-relative" data-id=${
              hero.id
            }>
<a href="./superhero.html?id=${hero.id}">
              <img src="${hero.thumbnail.path + "." + hero.thumbnail.extension}"
                class="card-img-top card-img" alt="${hero.name}" data-id=${
    hero.id
  } /></a>
              <div class="heart-container position-absolute ${hero.id}" >
                      ${handleLikeAndDislike(hero)}
              </div>
              <hr class="text-danger mb-0 d" />
              <div class="card-body text-light">
                <h5 class="card-title">${hero.name}</h5>
               
              </div>
            </div>`;
  cardsContainer.append(div);
}
// api call to get characters
async function getCharacters(ofst) {
  const { ts, hash } = tsAndHash();
  let pagesList = document.getElementsByClassName("pages-list")[0];
  pagesList.innerHTML = "";
  let cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = `<div id="loader-container">
  <span id="loader"></span>
  <h3>LOADING...</h3></div>`;
  const response = await axios.get(
    `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}&limit=${limit}&offset=${ofst}`
  );
  const { count, total } = response.data.data;
  results = response.data.data.results;
  pages = Math.ceil(total / limit);
  for (let i = 1; i <= pages; i++) {
    let li = document.createElement("li");
    li.innerHTML = `<span class="dropdown-item page-num">${i}</span>`;
    pagesList.append(li);
  }
  cardsContainer.innerHTML = "";
  results.forEach((element) => {
    addHeroToDOM(element, cardsContainer);
  });
}

if (
  window.location.pathname == "/index.html" ||
  window.location.pathname == "/" ||
  window.location.pathname == "/coding-ninjas-hero-hunter-js/"
) {
  getCharacters(offset);
}
// get characters from local storage
export function getFavouriteCharacters() {
  let cardsContainer = document.getElementById("cards");
  cardsContainer.style.marginTop = "-10px";
  cardsContainer.innerHTML = "";
  let fav = JSON.parse(localStorage.getItem("favouriteHeros"));
  if (fav && fav.length > 0) {
    fav.forEach((element) => {
      addHeroToDOM(element, cardsContainer);
    });
  } else {
    cardsContainer.innerHTML = `<h1 class="text-center m-auto mt-5 text-light">Add Favourites...</h1>`;
  }
}

if (
  window.location.pathname == "/myFavourites.html" ||
  window.location.pathname == "/myFavourites" ||
  window.location.pathname == "/coding-ninjas-hero-hunter-js/myFavourites.html"
) {
  let title = document.getElementsByTagName("title");
  title[0].innerText = "My Favourites";
  getFavouriteCharacters();
}

// event listeners for likes and dislikes and page count
window.addEventListener("click", (event) => {
  if (
    window.location.pathname == "/index.html" ||
    window.location.pathname == "/myFavourites.html"
  ) {
    let heroId = event.target.dataset.id;
    if (event.target.classList.contains("page-num")) {
      let page = Number(event.target.innerText);
      offset = (page - 1) * 50;
      getCharacters(offset);
    }
    if (
      event.target.classList.contains("likes") &&
      !event.target.classList.contains("search")
    ) {
      favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));

      let heartContainer = document.getElementsByClassName(heroId);
      let arr;
      if (window.location.pathname == "/index.html") {
        arr = results;
      } else {
        arr = favouriteHeros;
      }
      const clickedHero = arr.filter((hero) => hero.id == heroId);

      if (favouriteHeros == null || favouriteHeros.length == 0) {
        localStorage.setItem("favouriteHeros", JSON.stringify(clickedHero));
        for (let elem of heartContainer) {
          elem.innerHTML = "";
          elem.innerHTML = fillHeart(heroId);
        }

        favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
      } else {
        let isFavouriteHero = favouriteHeros.findIndex(
          (hero) => hero.id == heroId
        );
        if (isFavouriteHero == -1) {
          if (clickedHero[0]) {
            favouriteHeros.push(clickedHero[0]);
            localStorage.setItem(
              "favouriteHeros",
              JSON.stringify(favouriteHeros)
            );
            for (let elem of heartContainer) {
              elem.innerHTML = "";
              elem.innerHTML = fillHeart(heroId);
            }
          }
        } else {
          favouriteHeros.splice(isFavouriteHero, 1);
          localStorage.setItem(
            "favouriteHeros",
            JSON.stringify(favouriteHeros)
          );
          for (let elem of heartContainer) {
            elem.innerHTML = "";
            elem.innerHTML = emptyHeart(heroId);
          }
          favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
          if (
            window.location.pathname == "/myFavourites.html" ||
            window.location.pathname == "/myFavourites"
          ) {
            getFavouriteCharacters();
          }
        }
      }
    }
  }
});
