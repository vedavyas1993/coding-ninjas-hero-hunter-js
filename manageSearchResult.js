import { getFavouriteCharacters } from "./index.js";
import { tsAndHash } from "./utils/hashGenerator.js";
import {
  emptyHeart,
  fillHeart,
  handleLikeAndDislike,
} from "./utils/heartIcons.js";
const searchResult = document.getElementById("search-result");
const search = document.getElementById("search");
let searchResults;
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
  li.innerHTML = `<a href="./superhero.html?id=${hero.id}" >
              <img src="${hero.thumbnail.path + "." + hero.thumbnail.extension}"
                class="search-img" alt="${hero.name}" data-id=${hero.id} />
  <span>${hero.name}</span></a>
              <div class="heart-container position-absolute ${hero.id}">
                      ${handleLikeAndDislike(hero, "search")}
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

  searchResults = response.data.data.results;
  searchResult.innerHTML = "";

  searchResults.forEach((element) => {
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
  favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
  if (!event.target.classList.contains("dropdown-item")) {
    searchResult.style.display = "none";
  }
  if (
    event.target.type == "search" ||
    (event.target.classList.contains("likes") &&
      event.target.classList.contains("search"))
  ) {
    searchResult.style.display = "flex";
  } else {
    searchResult.style.display = "none";
  }
  if (
    event.target.classList.contains("likes") &&
    event.target.classList.contains("search")
  ) {
    let heartContainer = document.getElementsByClassName(heroId);
    let arr = searchResults;
    const clickedHero = arr.filter((hero) => hero.id == heroId);
    if (favouriteHeros == null || favouriteHeros.length == 0) {
      localStorage.setItem("favouriteHeros", JSON.stringify(clickedHero));
      for (let elem of heartContainer) {
        elem.innerHTML = "";
        elem.innerHTML = fillHeart(heroId, "search");
      }

      favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
      loadFavHeros();
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
            elem.innerHTML = fillHeart(heroId, "search");
          }
          favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
          loadFavHeros();
        }
      } else {
        favouriteHeros.splice(isFavouriteHero, 1);
        localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHeros));
        for (let elem of heartContainer) {
          elem.innerHTML = "";
          elem.innerHTML = emptyHeart(heroId, "search");
        }
        favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
        loadFavHeros();
      }
    }
  }
});
