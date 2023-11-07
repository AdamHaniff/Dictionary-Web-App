// VARIABLES
const headerFontContainer = document.querySelector(".header__font-container");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFont = document.querySelector(".header__font");
const bodyElement = document.body;
const fontInter = getComputedStyle(document.documentElement).getPropertyValue(
  "--font-inter"
);
const fontLora = getComputedStyle(document.documentElement).getPropertyValue(
  "--font-lora"
);
const fontInconsolata = getComputedStyle(
  document.documentElement
).getPropertyValue("--font-inconsolata");

// FUNCTIONS
function hideHeaderFontStyles() {
  headerFontStyles.classList.add("hidden");
}

// EVENT LISTENER CALLBACK FUNCTIONS
function handleHeaderFontContainerClick(e) {
  const headerFontContainer = e.target.closest(".header__font-container");
  if (!headerFontContainer) return;

  // If 'headerFontStyles' is currently being displayed, hide it
  if (
    !headerFontStyles.classList.contains("hidden") &&
    e.target.closest(".header__font-styles") !== headerFontStyles
  ) {
    hideHeaderFontStyles();
    return;
  }

  // Display headerFontStyles
  headerFontStyles.classList.remove("hidden");
}

function handleHeaderFontStylesClick(e) {
  if (e.target.classList.contains("header__font-style")) {
    // Change the textContent of 'headerFont' to the font style that was clicked
    const fontStyle = e.target.textContent;
    headerFont.textContent = fontStyle;

    hideHeaderFontStyles();

    // Change body element's 'font-family' value to the font style that was clicked
    if (fontStyle === "Sans Serif") {
      bodyElement.style.fontFamily = fontInter;
    } else if (fontStyle === "Serif") {
      bodyElement.style.fontFamily = fontLora;
    } else if (fontStyle === "Mono") {
      bodyElement.style.fontFamily = fontInconsolata;
    }

    // Stop the click event from propagating to the parent container
    e.stopPropagation();
  }
}

function handleDocumentClick(e) {
  if (e.target.closest(".header__font-container") !== headerFontContainer) {
    hideHeaderFontStyles();
  }
}

// EVENT LISTENERS
headerFontContainer.addEventListener("click", handleHeaderFontContainerClick);
headerFontStyles.addEventListener("click", handleHeaderFontStylesClick);
document.addEventListener("click", handleDocumentClick);
