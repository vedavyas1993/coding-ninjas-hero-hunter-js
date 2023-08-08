// function for timestamp and hash generation
function tsAndHash() {
  let ts = Date.now();
  let hash = CryptoJS.MD5(
    ts +
      "31ae0263348c45192241c66356f2a13e35a9c47b" +
      "d2f97728c6c92cd4cf6452b07f556304"
  ).toString();
  return { ts, hash };
}

let limit = 50;
let offset = 0;
let pages;
let results;
let favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));

// empty like icon
function emptyHeart(id) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="red"
      data-id=${id}
      class="bi bi-heart likes"
      viewBox="0 0 16 16"
    >
      <path data-id=${id} class="likes" d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
    </svg>
  `;
}
// filled like icon
function fillHeart(id) {
  return `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="red"
          class="bi bi-heart-fill likes"
          viewBox="0 0 16 16"
          data-id=${id}
>
          <path
                      data-id=${id}
                      class="likes"
            fill-rule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
          />
        </svg>`;
}

// like handler while loading
function handleLikeAndDislike(hero) {
  const emptyLikeIcon = emptyHeart(hero.id);
  const fillLikeIcon = fillHeart(hero.id);
  if (favouriteHeros == null || favouriteHeros?.length == 0)
    return emptyLikeIcon;
  favouriteHeros.findIndex((elem) => elem.id == hero.id) != -1;
  return favouriteHeros.findIndex((elem) => elem.id == hero.id) != -1
    ? fillLikeIcon
    : emptyLikeIcon;
}
// function to add heros list to dom
function addHeroToDOM(hero, cardsContainer) {
  let div = document.createElement("div");
  div.classList.add("col");
  div.innerHTML = `
            <div class="card h-100 bg-dark position-relative" data-id=${
              hero.id
            }>

              <img src="${hero.thumbnail.path + "." + hero.thumbnail.extension}"
                class="card-img-top card-img" alt="${hero.name}" data-id=${
    hero.id
  } />
              <div class="heart-container position-absolute" id=${hero.id}>
                      ${handleLikeAndDislike(hero)}
              </div>
              <hr class="text-danger" />
              <div class="card-body text-light">
                <h5 class="card-title">${hero.name}</h5>
                <p class="card-text">
                  This is a longer card with supporting text below as a natural
                  lead-in to additional content. This content is a little bit
                  longer.
                </p>
              </div>
            </div>`;
  cardsContainer.append(div);
}
// api call to get characters
async function getCharacters(ofst) {
  const { ts, hash } = tsAndHash();
  let pagesList = document.getElementsByClassName("pages-list")[0];
  let cardsContainer = document.getElementById("cards");
  cardsContainer.innerHTML = `<div id="loader-container">
  <span id="loader"></span>
  <h3>LOADING...</h3></div>`;
  const response = await axios.get(
    `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}&limit=${limit}&offset=${ofst}`
  );
  // let response;
  // await fetch(
  //   `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=d2f97728c6c92cd4cf6452b07f556304&hash=${hash}&limit=${limit}&offset=${ofst}`
  // )
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     // Process the data here
  //     console.log(data);
  //     response = data;
  //   })
  //   .catch((error) => {
  //     // Handle errors here
  //     console.error("Error fetching data:", error);
  //   });
  // results is items
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
  window.location.pathname == "/"
)
  getCharacters(offset);
// get characters from local storage
function getFavouriteCharacters() {
  let cardsContainer = document.getElementById("cards");
  cardsContainer.style.marginTop = "-10px";
  cardsContainer.innerHTML = "";
  let fav = JSON.parse(localStorage.getItem("favouriteHeros"));
  if (fav && fav.length > 0) {
    fav.forEach((element) => {
      addHeroToDOM(element, cardsContainer);
    });
  } else {
    cardsContainer.innerHTML = `<h1 class="text-center m-auto mt-5 text-danger">Add Favourites</h1>`;
  }
}

if (
  window.location.pathname == "/myFavourites.html" ||
  window.location.pathname == "/myFavourites"
) {
  getFavouriteCharacters();
}

// event listeners for likes and dislikes and page count
window.addEventListener("click", (event) => {
  let heroId = event.target.dataset.id;
  if (event.target.classList.contains("page-num")) {
    let page = Number(event.target.innerText);
    offset = (page - 1) * 50;
    getCharacters(offset);
  }
  if (event.target.classList.contains("likes")) {
    let heartContainer = document.getElementById(heroId);
    let arr = results ? results : favouriteHeros;
    const clickedHero = arr.filter((hero) => hero.id == heroId);
    if (favouriteHeros == null || favouriteHeros.length == 0) {
      localStorage.setItem("favouriteHeros", JSON.stringify(clickedHero));
      heartContainer.innerHTML = "";
      heartContainer.innerHTML = fillHeart(heroId);
      favouriteHeros = JSON.parse(localStorage.getItem("favouriteHeros"));
    } else {
      let isFavouriteHero = favouriteHeros.findIndex(
        (hero) => hero.id == heroId
      );
      if (isFavouriteHero == -1) {
        favouriteHeros.push(clickedHero[0]);
        localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHeros));
        heartContainer.innerHTML = "";
        heartContainer.innerHTML = fillHeart(heroId);
      } else {
        favouriteHeros.splice(isFavouriteHero, 1);
        localStorage.setItem("favouriteHeros", JSON.stringify(favouriteHeros));
        heartContainer.innerHTML = "";
        heartContainer.innerHTML = emptyHeart(heroId);
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
});
