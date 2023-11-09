// VARIABLES
const headerFontContainer = document.querySelector(".header__font-container");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFont = document.querySelector(".header__font");
const bodyElement = document.body;

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

    // Remove all existing font classes
    bodyElement.classList.remove(
      "body--font-inter",
      "body--font-lora",
      "body--font-inconsolata"
    );

    // Change body element's 'font-family' value to the font style that was clicked
    if (fontStyle === "Sans Serif") {
      bodyElement.classList.add("body--font-inter");
    } else if (fontStyle === "Serif") {
      bodyElement.classList.add("body--font-lora");
    } else if (fontStyle === "Mono") {
      bodyElement.classList.add("body--font-inconsolata");
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
