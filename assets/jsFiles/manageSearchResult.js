window.addEventListener("click", (event) => {
  if (!event.target.classList.contains("dropdown-item")) {
    let searchResult = document.getElementById("search-result");
    searchResult.style.visibility = "hidden";
  }
  if (event.target.type == "search") {
    let searchResult = document.getElementById("search-result");
    searchResult.style.visibility = "visible";
  }
});
