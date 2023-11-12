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
let word;
let partOfSpeech;
let horizontalLine;
let wordMeaning;
let source;
let sourceLink;
const notFoundText = document.querySelector(".not-found__text");
const headerFontStyles = document.querySelector(".header__font-styles");
const headerFontStyle = document.querySelectorAll(".header__font-style");

// FUNCTIONS
function changeWordColor() {
  word = document.querySelector(".word");
  if (word) word.classList.toggle("word--dark");
}

function changePartOfSpeechColor() {
  partOfSpeech = document.querySelectorAll(".part-of-speech");
  if (partOfSpeech) {
    for (let el of partOfSpeech) {
      el.classList.toggle("part-of-speech--dark");
    }
  }
}

function changeHorizontalLineColor() {
  horizontalLine = document.querySelectorAll(".horizontal-line");
  if (horizontalLine) {
    for (let el of horizontalLine) {
      el.classList.toggle("horizontal-line--dark");
    }
  }
}

function changeWordMeaningColor() {
  wordMeaning = document.querySelectorAll(".word-meaning");
  if (wordMeaning) {
    for (let el of wordMeaning) {
      el.classList.toggle("word-meaning--dark");
    }
  }
}

function changeSourceBorderTopColor() {
  source = document.querySelector(".source");
  if (source) source.classList.toggle("source--dark");
}

function changeSourceLinkColor() {
  sourceLink = document.querySelector(".source__link");
  if (sourceLink) sourceLink.classList.toggle("source__link--dark");
}

function changeHeaderFontStyleColor() {
  for (let el of headerFontStyle) {
    el.classList.toggle("header__font-style--dark");
  }
}

function switchToLightTheme() {
  bodyElement.classList.toggle("body--dark");
  headerFont.classList.toggle("header__font--dark");
  headerMoonIconPath.classList.toggle("header__moon-icon-path--dark");
  formInput.classList.toggle("form__input--dark");
  spinner.classList.toggle("spinner--dark");
  changeWordColor();
  changePartOfSpeechColor();
  changeHorizontalLineColor();
  changeWordMeaningColor();
  changeSourceBorderTopColor();
  changeSourceLinkColor();
  notFoundText.classList.toggle("not-found__text--dark");
  headerFontStyles.classList.toggle("header__font-styles--dark");
  changeHeaderFontStyleColor();
}

function switchToDarkTheme() {
  bodyElement.classList.toggle("body--dark");
  headerFont.classList.toggle("header__font--dark");
  headerMoonIconPath.classList.toggle("header__moon-icon-path--dark");
  formInput.classList.toggle("form__input--dark");
  spinner.classList.toggle("spinner--dark");
  changeWordColor();
  changePartOfSpeechColor();
  changeHorizontalLineColor();
  changeWordMeaningColor();
  changeSourceBorderTopColor();
  changeSourceLinkColor();
  notFoundText.classList.toggle("not-found__text--dark");
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

  if (colorTheme.isLightTheme) {
    colorTheme.isLightTheme = false;
    switchToDarkTheme();
  } else {
    colorTheme.isLightTheme = true;
    switchToLightTheme();
  }
}

// EVENT LISTENER
headerToggleBtn.addEventListener("click", handleHeaderToggleBtnClick);

export default colorTheme;
