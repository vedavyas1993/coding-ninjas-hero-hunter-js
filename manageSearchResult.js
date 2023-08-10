import { getFavouriteCharacters } from "./index.js";
import { tsAndHash } from "./utils/hashGenerator.js";
import {
  emptyHeart,
  fillHeart,
  handleLikeAndDislike,
} from "./utils/heartIcons.js";
const searchResult = document.getElementById("search-result");
const search = document.getElementById("search");

let results;
let favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));

search.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    getCharacters(event.target.value.trim());
  }
});

// function to add heros list to dom
function addHeroToDOM(hero, searchResult) {
  let li = document.createElement("li");
  li.classList.add("d-flex");
  li.classList.add("position-relative");
  li.innerHTML = `
              <img src="${hero.thumbnail.path + "." + hero.thumbnail.extension}"
                class="search-img" alt="${hero.name}" data-id=${hero.id} />
  <span>${hero.name}</span>
              <div class="heart-container position-absolute ${hero.id}">
                      ${handleLikeAndDislike(hero, favouriteHeros)}
              </div>`;
  searchResult.append(li);
}
// api call to get characters
async function getCharacters(searchStr) {
  const { ts, hash } = tsAndHash();
  searchResult.innerHTML = "";
  searchResult.innerHTML = `<div id="loader-container">
  <span id="loader"></span>
  <h3>LOADING...</h3></div>`;
  const response = await axios.get(
    `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}&nameStartsWith=${searchStr}`
  );

  results = response.data.data.results;
  searchResult.innerHTML = "";

  results.forEach((element) => {
    addHeroToDOM(element, searchResult);
  });
}

function loadFavHeros() {
  if (
    window.location.pathname == "/myFavourites.html" ||
    window.location.pathname == "/myFavourites"
  ) {
    getFavouriteCharacters();
  }
}
window.addEventListener("click", (event) => {
  let heroId = event.target.dataset.id;

  if (!event.target.classList.contains("dropdown-item")) {
    searchResult.style.display = "none";
  }
  if (event.target.type == "search") {
    searchResult.style.display = "flex";
  }
  if (event.target.classList.contains("likes")) {
    let heartContainer = document.getElementsByClassName(heroId);
    let arr = results ? results : favouriteHeros;
    const clickedHero = arr.filter((hero) => hero.id == heroId);
    if (favouriteHeros == null || favouriteHeros.length == 0) {
      localStorage.setItem("favouriteHeros", JSON.stringify(clickedHero));
      for (let elem of heartContainer) {
        elem.innerHTML = "";
        elem.innerHTML = fillHeart(heroId);
      }

      favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
      loadFavHeros();
    } else {
      let isFavouriteHero = favouriteHeros.findIndex(
        (hero) => hero.id == heroId
      );
      if (isFavouriteHero == -1) {
        favouriteHeros.push(clickedHero[0]);
        localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHeros));
        for (let elem of heartContainer) {
          elem.innerHTML = "";
          elem.innerHTML = fillHeart(heroId);
        }
        favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
        loadFavHeros();
      } else {
        favouriteHeros.splice(isFavouriteHero, 1);
        localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHeros));
        for (let elem of heartContainer) {
          elem.innerHTML = "";
          elem.innerHTML = emptyHeart(heroId);
        }
        favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
        loadFavHeros();
      }
    }
  }
});
