import { tsAndHash } from "./utils/hashGenerator.js";

const superHeroId = window.location.search.split("=")[1];
const heroContainer = document.getElementsByClassName("hero-container");
async function getHero(heroId) {
  const { ts, hash } = tsAndHash();
  heroContainer[0].innerHTML = `<div id="loader-container">
  <span id="loader"></span>
  <h3>LOADING...</h3></div>`;
  const response = await axios.get(
    `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}`
  );
  const character = response.data.data.results[0];
  console.log(response.data.data.results[0]);
  heroContainer[0].innerHTML = `<h1 class="text-light text-center">${character.name}</h1>`;
}

getHero(superHeroId);
