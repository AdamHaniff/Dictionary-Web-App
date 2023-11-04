// VARIABLES
const headerFontContainer = document.querySelector(".header__font-container");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFont = document.querySelector(".header__font");

headerFontContainer.addEventListener("click", function (e) {
  const headerFontContainer = e.target.closest(".header__font-container");
  if (!headerFontContainer) return;

  // Display headerFontStyles
  headerFontStyles.classList.remove("hidden");
});

headerFontStyles.addEventListener("click", function (e) {
  if (e.target.classList.contains("header__font-style")) {
    // Change the textContent of 'headerFont' to the font style that was clicked
    headerFont.textContent = e.target.textContent;

    // Hide 'headerFontStyles'
    // console.log(headerFontStyles);
    // headerFontStyles.classList.add("hidden");
  }
});
