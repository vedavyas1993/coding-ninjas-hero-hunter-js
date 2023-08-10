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
  console.log(results);
  searchResult.innerHTML = "";

  results.forEach((element) => {
    addHeroToDOM(element, searchResult);
  });
}

window.addEventListener("click", (event) => {
  console.log(event.target);
  if (!event.target.classList.contains("dropdown-item")) {
    searchResult.style.display = "none";
  }
  if (event.target.type == "search") {
    searchResult.style.display = "flex";
  }
  if (
    event.target.classList.contains("likes") &&
    (window.location.pathname == "/myFavourites.html" ||
      window.location.pathname == "/myFavourites")
  ) {
    getFavouriteCharacters();
  }
});
