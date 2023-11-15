// HELPERS
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
    phoneticValue = phonetics[0].text;
  }

  return phoneticValue === undefined ? "" : phoneticValue;
}

function isAudioAvailable(phonetics, language, location) {
  return phonetics.some((phonetic) =>
    doesPhoneticAudioMatch(phonetic, language, location)
  );
}

function hideLoadingSpinner(spinnerElement) {
  spinnerElement.classList.add("hidden");
}

function displayLoadingSpinner(spinnerElement) {
  spinnerElement.classList.remove("hidden");
}

function displayFormInputError(
  spinnerElement,
  formInputElement,
  formInputErrorElement,
  notFoundElement
) {
  hideLoadingSpinner(spinnerElement);

  // Remove focus from 'formInput'
  formInputElement.blur();

  // Turn the border of 'formInput' red
  formInputElement.classList.add("form__input--red");

  // Display 'form__input-error'
  formInputErrorElement.classList.remove("hidden");

  // Hide 'notFound' div if it is currently being displayed
  notFoundElement.classList.add("hidden");
}

function hideFormInputError(formInputElement, formInputErrorElement) {
  // Remove 'form__input--red' class from 'formInput' if it is present.
  formInputElement.classList.remove("form__input--red");

  // Hide 'formInputError' if it is currently being displayed.
  formInputErrorElement.classList.add("hidden");
}

function displayNotFoundDiv(
  spinnerElement,
  formInputElement,
  formInputErrorElement,
  resultsContainerElement,
  notFoundElement
) {
  hideLoadingSpinner(spinnerElement);

  // Remove focus from 'formInput'
  formInputElement.blur();

  hideFormInputError(formInputElement, formInputErrorElement);

  // If there is a definition currenty being displayed, it needs to be removed.
  resultsContainerElement.innerHTML = "";

  // Display the 'notFound' div
  notFoundElement.classList.remove("hidden");
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export {
  getLanguageAndLocation,
  doesPhoneticAudioMatch,
  getPhonetic,
  isAudioAvailable,
  hideLoadingSpinner,
  displayLoadingSpinner,
  displayFormInputError,
  hideFormInputError,
  displayNotFoundDiv,
  capitalizeFirstLetter,
};
