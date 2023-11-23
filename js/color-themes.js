import { updateElementColors } from "./helpers";

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
const classesToToggle = [
  { element: bodyElement, className: "body--dark" },
  { element: headerFont, className: "dark" },
  { element: headerMoonIconPath, className: "header__moon-icon-path--dark" },
  { element: formInput, className: "form__input--dark" },
  { element: spinner, className: "spinner--dark" },
  { element: notFoundText, className: "dark" },
  { element: headerFontStyles, className: "header__font-styles--dark" },
];

// FUNCTIONS
function changeColorTheme() {
  // Change background of 'headerToggleRectangle' and change the position of 'headerToggleOval' depending on the color theme.
  headerToggleRectangle.classList.toggle("header__toggle-rectangle--dark");
  headerToggleOval.classList.toggle("header__toggle-oval--dark");

  // Change the boolean value of the 'isLightTheme' property to the opposite and update the colors based on the current color theme.
  colorTheme.isLightTheme = !colorTheme.isLightTheme;
  updateElementColors(classesToToggle);
}

(function () {
  // Check if the user prefers dark mode
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    // Change color theme to dark
    changeColorTheme();
  }
})();

// EVENT LISTENER CALLBACK FUNCTION
function handleHeaderToggleBtnClick(e) {
  const headerToggleBtn = e.target.closest(".header__toggle-btn");
  if (!headerToggleBtn) return;

  // Change the color theme to light or dark.
  changeColorTheme();
}

// EVENT LISTENER
headerToggleBtn.addEventListener("click", handleHeaderToggleBtnClick);

export default colorTheme;
