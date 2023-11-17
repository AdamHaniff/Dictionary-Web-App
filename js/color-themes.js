// VARIABLES
const colorTheme = { isLightTheme: true };
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
const notFoundText = document.querySelector(".not-found__text");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFontStyle = document.querySelectorAll(".header__font-style");

// FUNCTIONS
function toggleElementColor(elementClass, colorClass) {
  element = document.querySelector(`.${elementClass}`);
  if (element) element.classList.toggle(colorClass);
}

function toggleMultipleElementColor(elementsClass, colorClass) {
  elements = document.querySelectorAll(`.${elementsClass}`);
  if (elements) {
    for (let el of elements) {
      el.classList.toggle(colorClass);
    }
  }
}

function changeHeaderFontStyleColor() {
  for (let el of headerFontStyle) {
    el.classList.toggle("dark");
  }
}

function changeColorTheme() {
  // Change the boolean value of the 'isLightTheme' property to the opposite.
  colorTheme.isLightTheme = !colorTheme.isLightTheme;

  // Toggle classes on/off for the following elements based on the current color theme.
  bodyElement.classList.toggle("body--dark");
  headerFont.classList.toggle("dark");
  headerMoonIconPath.classList.toggle("header__moon-icon-path--dark");
  formInput.classList.toggle("form__input--dark");
  spinner.classList.toggle("spinner--dark");
  toggleElementColor("word", "dark");
  toggleMultipleElementColor("part-of-speech", "dark");
  toggleMultipleElementColor("horizontal-line", "horizontal-line--dark");
  toggleMultipleElementColor("word-meaning", "dark");
  toggleElementColor("source", "source--dark");
  toggleElementColor("source__link", "source__link--dark");
  notFoundText.classList.toggle("dark");
  headerFontStyles.classList.toggle("header__font-styles--dark");
  changeHeaderFontStyleColor();
}

// EVENT LISTENER CALLBACK FUNCTION
function handleHeaderToggleBtnClick(e) {
  const headerToggleBtn = e.target.closest(".header__toggle-btn");
  if (!headerToggleBtn) return;

  // Change background of 'headerToggleRectangle' and change the position of 'headerToggleOval' depending on the color theme.
  headerToggleRectangle.classList.toggle("header__toggle-rectangle--dark");
  headerToggleOval.classList.toggle("header__toggle-oval--dark");

  // Change the color theme to light or dark.
  changeColorTheme();
}

// EVENT LISTENER
headerToggleBtn.addEventListener("click", handleHeaderToggleBtnClick);

export default colorTheme;
