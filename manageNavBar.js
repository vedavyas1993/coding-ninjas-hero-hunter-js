// managing active links
function manageNavLinks() {
  let links = document.getElementsByClassName("nav-link");

  if (
    window.location.pathname == "/index.html" ||
    window.location.pathname == "/"
  ) {
    links[0].classList.add("active");
  }
  if (
    window.location.pathname == "/myFavourites.html" ||
    window.location.pathname == "/myFavourites"
  ) {
    links[1].classList.add("active");
  }
}
window.onload = () => manageNavLinks();
