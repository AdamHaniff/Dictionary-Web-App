import {
  hideElement,
  removeClasses,
  changeFontFamily,
  displayElement,
} from "./helpers";

// VARIABLES
const headerFontContainer = document.querySelector(".header__font-container");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFont = document.querySelector(".header__font");
const bodyElement = document.body;

// EVENT LISTENER CALLBACK FUNCTIONS
function handleHeaderFontContainerClick(e) {
  const headerFontContainer = e.target.closest(".header__font-container");
  if (!headerFontContainer) return;

  // If 'headerFontStyles' is currently being displayed, hide it.
  const isHeaderFontStylesDisplayed =
    !headerFontStyles.classList.contains("hidden") &&
    e.target.closest(".header__font-styles") !== headerFontStyles;

  if (isHeaderFontStylesDisplayed) {
    hideElement(headerFontStyles);
    return;
  }

  // Display headerFontStyles
  displayElement(headerFontStyles);
}

function handleHeaderFontStylesClick(e) {
  if (e.target.classList.contains("header__font-style")) {
    // Change the textContent of 'headerFont' to the font style that was clicked and hide 'headerFontStyles'.
    const fontStyle = e.target.textContent;
    headerFont.textContent = fontStyle;
    hideElement(headerFontStyles);

    // Remove all existing font classes
    removeClasses(
      bodyElement,
      "body--font-inter",
      "body--font-lora",
      "body--font-inconsolata"
    );

    // Change body element's 'font-family' value to the font style that was clicked
    changeFontFamily(fontStyle, bodyElement);

    // Stop the click event from propagating to the parent container
    e.stopPropagation();
  }
}

function handleDocumentClick(e) {
  if (e.target.closest(".header__font-container") !== headerFontContainer) {
    hideElement(headerFontStyles);
  }
}

// EVENT LISTENERS
headerFontContainer.addEventListener("click", handleHeaderFontContainerClick);
headerFontStyles.addEventListener("click", handleHeaderFontStylesClick);
document.addEventListener("click", handleDocumentClick);
