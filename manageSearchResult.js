let searchResult = document.getElementById("search-result");
window.addEventListener("click", (event) => {
  if (!event.target.classList.contains("dropdown-item")) {
    searchResult.style.display = "none";
  }
  if (event.target.type == "search") {
    searchResult.style.display = "flex";
  }
});
