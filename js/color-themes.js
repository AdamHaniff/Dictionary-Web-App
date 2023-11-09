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
const spinner = document.querySelector(".spinner");

// FUNCTIONS
function switchToLightTheme() {
  bodyElement.classList.toggle("body--dark");
  headerFont.classList.toggle("header__font--dark");
  headerMoonIconPath.classList.toggle("header__moon-icon-path--dark");
  formInput.classList.toggle("form__input--dark");
  spinner.classList.toggle("spinner--dark");
}

function switchToDarkTheme() {
  bodyElement.classList.toggle("body--dark");
  headerFont.classList.toggle("header__font--dark");
  headerMoonIconPath.classList.toggle("header__moon-icon-path--dark");
  formInput.classList.toggle("form__input--dark");
  spinner.classList.toggle("spinner--dark");
}

// EVENT LISTENER
headerToggleBtn.addEventListener("click", function (e) {
  const headerToggleBtn = e.target.closest(".header__toggle-btn");
  if (!headerToggleBtn) return;

  // Change background of 'headerToggleRectangle' and change the position of 'headerToggleOval' depending on the color theme.
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

export default isLightTheme;
