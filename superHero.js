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
  <div class="card h-100 character" data-id=${hero.id} style="width:400px">
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
  // LINKS
  if (character.urls && character.urls.length > 0) {
    let h3 = document.createElement("h3");
    h3.innerHTML = `Links :`;
    info[0].append(h3);
    for (let link of character.urls) {
      let a = document.createElement("a");
      a.setAttribute("href", `${link.url}`);
      a.setAttribute("target", `_blank`);

      a.innerHTML = `${link.type}`;
      info[0].append(a);
    }
  }
  // comics
  if (character.comics.items && character.comics.items.length > 0) {
    let h3 = document.createElement("h3");
    h3.innerHTML = `Comics :`;
    info[0].append(h3);
    for (let item of character.comics.items) {
      let p = document.createElement("p");
      p.innerHTML = `${item.name}`;
      info[0].append(p);
    }
  }
  // SERIES

  if (character.series.items && character.series.items.length > 0) {
    let h3 = document.createElement("h3");
    h3.innerHTML = `Series :`;
    info[0].append(h3);
    for (let item of character.series.items) {
      let p = document.createElement("p");
      p.innerHTML = `${item.name}`;
      info[0].append(p);
    }
  }
  // STORIES;
  if (character.stories.items && character.stories.items.length > 0) {
    let h3 = document.createElement("h3");
    h3.innerHTML = `Stories :`;
    info[0].append(h3);
    for (let item of character.stories.items) {
      let p = document.createElement("p");
      p.innerHTML = `${item.name}`;
      info[0].append(p);
    }
  }
  // Events
  if (character.events.items && character.events.items.length > 0) {
    let h3 = document.createElement("h3");
    h3.innerHTML = `Events :`;
    info[0].append(h3);
    for (let item of character.events.items) {
      console.log(item);
      let p = document.createElement("p");
      p.innerHTML = `${item.name}`;
      info[0].append(p);
    }
  }
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
