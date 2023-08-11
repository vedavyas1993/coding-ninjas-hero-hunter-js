import { tsAndHash } from "./utils/hashGenerator.js";
import {
  emptyHeart,
  fillHeart,
  handleLikeAndDislike,
} from "./utils/heartIcons.js";
const { ts, hash } = tsAndHash();
const superHeroId = window.location.search.split("=")[1];
const heroContainer = document.getElementsByClassName("hero-container");

let character;
function addCharToDOM(hero, container) {
  let div = document.createElement("div");
  div.classList.add("d-flex");
  div.innerHTML = `
  <div class="card h-100 character position-relative" data-id=${
    hero.id
  } style="width:400px">
  <h1 class="text-light text-center">${character.name}</h1>
              <img src="${hero.thumbnail.path + "." + hero.thumbnail.extension}"
                class="card-img-top char-img" alt="${hero.name}" data-id=${
    hero.id
  } />
              <div class="heart-container position-absolute ${hero.id}" >
                      ${handleLikeAndDislike(hero)}
              </div>
            </div>
            <div class="info-container">
            </div>
            `;
  container.append(div);
  const info = document.getElementsByClassName("info-container");
  info[0].classList.add("text-light");
  info[0].innerHTML = `
  <h3>Description : </h3><p>${
    character.description ? character.description : "No info available."
  }</p>
    `;
}

async function getHero(heroId) {
  heroContainer[0].innerHTML = `<div id="loader-container">
  <span id="loader"></span>
  <h3>LOADING...</h3></div>`;
  const response = await axios.get(
    `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}`
  );
  character = response.data.data.results[0];
  heroContainer[0].innerHTML = "";
  addCharToDOM(character, heroContainer[0]);
}

getHero(superHeroId);

window.addEventListener("click", (event) => {
  if (window.location.pathname == "/superhero.html") {
    let heroId = event.target.dataset.id;
    let favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
    if (
      event.target.classList.contains("likes") &&
      !event.target.classList.contains("search")
    ) {
      let heartContainer = document.getElementsByClassName(heroId);
      if (favouriteHeros == null || favouriteHeros.length == 0) {
        localStorage.setItem("favouriteHeros", JSON.stringify([character]));
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
          favouriteHeros.push(character);
          localStorage.setItem(
            "favouriteHeros",
            JSON.stringify(favouriteHeros)
          );
          for (let elem of heartContainer) {
            elem.innerHTML = "";
            elem.innerHTML = fillHeart(heroId);
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
        }
      }
    }
  }
});
