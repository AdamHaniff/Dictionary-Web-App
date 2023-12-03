// HELPERS

// Helpers for every file
function hideElement(element) {
  element.classList.add("hidden");
}

function displayElement(element) {
  element.classList.remove("hidden");
}

// Helpers for 'main.js'
function getLanguageAndLocation() {
  const preferredLanguage = navigator.language;
  const [language, location] = preferredLanguage.split("-");
  return { language, location };
}

function doesPhoneticAudioMatch(phonetic, language, location) {
  const languageSubstring = `/${language}/`;
  const locationSubstring = `-${location.toLowerCase()}`;

  return (
    phonetic.audio.includes(languageSubstring) &&
    phonetic.audio.includes(locationSubstring)
  );
}

function getPhonetic(phonetics, language, location, data) {
  const phonetic = phonetics.find((phonetic) =>
    doesPhoneticAudioMatch(phonetic, language, location)
  );

  let phoneticValue = phonetic?.text || "";

  // If there is no audio value, then have the 'phoneticValue' be equal to the 'phonetic' property.
  if (phoneticValue === "" && data[0].hasOwnProperty("phonetic")) {
    phoneticValue = data[0].phonetic;
  }

  // If there is no audio value and there is no 'phonetic' property, have the 'phoneticValue' be equal to the 'text' property's value in the first object of the 'phonetics' array.
  if (phoneticValue === "" && !data[0].hasOwnProperty("phonetic")) {
    phoneticValue = phonetics[0]?.text;
  }

  return phoneticValue === undefined ? "" : phoneticValue;
}

function isAudioAvailable(phonetics, language, location) {
  return phonetics.some((phonetic) =>
    doesPhoneticAudioMatch(phonetic, language, location)
  );
}

function displayFormInputError(
  spinnerElement,
  formInputElement,
  formInputErrorElement,
  notFoundElement
) {
  hideElement(spinnerElement);

  // Remove focus from 'formInput'
  formInputElement.blur();

  // Turn the border of 'formInput' red
  formInputElement.classList.add("form__input--red");

  // Display 'form__input-error'
  displayElement(formInputErrorElement);

  // Hide 'notFound' div if it is currently being displayed
  hideElement(notFoundElement);
}

function hideFormInputError(formInputElement, formInputErrorElement) {
  // Remove 'form__input--red' class from 'formInput' if it is present.
  formInputElement.classList.remove("form__input--red");

  // Hide 'formInputError' if it is currently being displayed.
  hideElement(formInputErrorElement);
}

function displayNotFoundDiv(
  spinnerElement,
  formInputElement,
  formInputErrorElement,
  resultsContainerElement,
  notFoundElement
) {
  hideElement(spinnerElement);

  // Remove focus from 'formInput'
  formInputElement.blur();

  hideFormInputError(formInputElement, formInputErrorElement);

  // If there is a definition currenty being displayed, it needs to be removed.
  resultsContainerElement.innerHTML = "";

  // Display the 'notFound' div
  displayElement(notFoundElement);
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Helpers for 'color-themes.js'
function toggleElementColor(elementClass, colorClass) {
  const element = document.querySelector(`.${elementClass}`);
  if (element) element.classList.toggle(colorClass);
}

function toggleMultipleElementsColor(elementsClass, colorClass) {
  const elements = document.querySelectorAll(`.${elementsClass}`);
  if (elements) {
    for (let el of elements) {
      el.classList.toggle(colorClass);
    }
  }
}

function toggleClasses(classesToToggle) {
  classesToToggle.forEach(({ element, className }) => {
    element.classList.toggle(className);
  });
}

function updateElementColors(classesToToggle) {
  // Toggle classes on/off for elements that are already in the DOM.
  toggleClasses(classesToToggle);

  // Toggle classes on/off for elements that are not already in the DOM.
  toggleElementColor("word", "dark");
  toggleMultipleElementsColor("part-of-speech", "dark");
  toggleMultipleElementsColor("horizontal-line", "horizontal-line--dark");
  toggleMultipleElementsColor("word-meaning", "dark");
  toggleElementColor("source", "source--dark");
  toggleElementColor("source__text", "source__text--dark");
  toggleElementColor("source__link", "source__link--dark");
  toggleMultipleElementsColor("header__font-style", "dark");
}

// Helpers for 'font-styles.js'
function removeClasses(element, ...classes) {
  element.classList.remove(...classes);
}

function changeFontFamily(fontStyle, element) {
  if (fontStyle === "Sans Serif") {
    element.classList.add("body--font-inter");
  } else if (fontStyle === "Serif") {
    element.classList.add("body--font-lora");
  } else if (fontStyle === "Mono") {
    element.classList.add("body--font-inconsolata");
  }
}

export {
  hideElement,
  displayElement,
  getLanguageAndLocation,
  doesPhoneticAudioMatch,
  getPhonetic,
  isAudioAvailable,
  displayFormInputError,
  hideFormInputError,
  displayNotFoundDiv,
  capitalizeFirstLetter,
  updateElementColors,
  removeClasses,
  changeFontFamily,
};
