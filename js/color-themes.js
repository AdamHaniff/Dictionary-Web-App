// VARIABLES
let isLightTheme = true;

const bodyElement = document.body;
const headerFont = document.querySelector(".header__font");
const headerToggleBtn = document.querySelector(".header__toggle-btn");
const headerToggleOval = document.querySelector(".header__toggle-oval");
const headerToggleRectangle = document.querySelector(
  ".header__toggle-rectangle"
);
const headerMoonIconPath = document.querySelector(".header__moon-icon-path");
const formInput = document.querySelector(".form__input");

const colorWhite = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-white"
);
const colorBlack = getComputedStyle(document.documentElement).getPropertyValue(
  "--color-black"
);
const colorThunder = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-thunder");
const colorBoulder = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-boulder");
const colorJasminePurple = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-jasminePurple");
const colorWhiteSmoke = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-whiteSmoke");
const colorDarkJungleGreen = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-darkJungleGreen");
// COLORS FOR INPUT PLACEHOLDER
const colorSilverSand = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-silverSand");
const colorDavyGrey = getComputedStyle(
  document.documentElement
).getPropertyValue("--color-davyGrey");

// FUNCTIONS
function switchToLightTheme() {
  bodyElement.style.background = colorWhite;
  headerFont.style.color = colorThunder;
  headerMoonIconPath.style.stroke = colorBoulder;
  formInput.style.background = colorWhiteSmoke;
  formInput.style.color = colorThunder;
}

function switchToDarkTheme() {
  bodyElement.style.background = colorBlack;
  headerFont.style.color = colorWhite;
  headerMoonIconPath.style.stroke = colorJasminePurple;
  formInput.style.background = colorDarkJungleGreen;
  formInput.style.color = colorWhite;
}

// EVENT LISTENER
headerToggleBtn.addEventListener("click", function (e) {
  const headerToggleBtn = e.target.closest(".header__toggle-btn");
  if (!headerToggleBtn) return;

  // Change 'headerToggleRectangle' to purple and move 'headerToggleOval' to the right
  headerToggleRectangle.classList.toggle("header__toggle-rectangle--dark");
  headerToggleOval.classList.toggle("header__toggle-oval--dark");

  if (isLightTheme) {
    isLightTheme = false;
    switchToDarkTheme();
  } else {
    isLightTheme = true;
    switchToLightTheme();
  }
});
