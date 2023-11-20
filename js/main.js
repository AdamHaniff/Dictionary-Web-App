import {
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
} from "./helpers";
import {
  insertWordPhoneticAudioContainer,
  insertPlayAudioBtn,
  insertWordMeaningsDiv,
  insertDefinitions,
  insertSynonymsOrAntonyms,
  insertSource,
} from "./insert-HTML";
import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const formInputError = document.querySelector(".form__input-error");
const resultsContainer = document.querySelector(".results-container");
const loadingSpinner = document.querySelector(".loading-spinner");
const notFound = document.querySelector(".not-found");
const { language, location } = getLanguageAndLocation();
const info = { phonetics: undefined };
const termsCount = { synonymsCount: -1, antonymsCount: -1 };
let data;
let meanings;

// FUNCTIONS
function resetState() {
  displayElement(loadingSpinner);

  // Remove focus from 'formInput'
  formInput.blur();

  // Remove definition if it is currently being displayed
  resultsContainer.innerHTML = "";

  // Hide 'formInputError' if it is currently displayed
  hideFormInputError(formInput, formInputError);

  // Hide 'notFound' div if it is currently displayed
  hideElement(notFound);

  // Reset 'synonymsCount' and 'antonymsCount' back to -1
  termsCount.synonymsCount = -1;
  termsCount.antonymsCount = -1;
}

// EVENT LISTENER CALLBACK FUNCTIONS
async function getWordDefinition(e, word) {
  e.preventDefault();

  // If the user submits a blank form, display the 'formInputError' element.
  if (word === "") {
    displayFormInputError(loadingSpinner, formInput, formInputError, notFound);
    return;
  }

  try {
    resetState();

    // Fetch response from API
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      // If a word doesn't exist, we will get an error. In this scenario we want to display the 'not-found' div.
      displayNotFoundDiv(
        loadingSpinner,
        formInput,
        formInputError,
        resultsContainer,
        notFound
      );

      throw new Error("Network response was not ok");
    }

    // CODE FOR WHEN WE GET BACK A VALID RESPONSE

    // Retrieve data and hide the 'loadingSpinner'
    data = await response.json();
    hideElement(loadingSpinner);

    // Generate and insert HTML based on the data
    insertWordPhoneticAudioContainer(
      data,
      info,
      resultsContainer,
      getPhonetic,
      language,
      location
    );

    // Insert HTML for the 'playAudioBtn' if the audio pronunciation is available.
    insertPlayAudioBtn(isAudioAvailable, info, language, location);

    // Insert 'word-meanings' div based on how many meanings there are.
    meanings = data[0].meanings;

    for (let i = 0; i < meanings.length; i++) {
      // Insert "word-meanings" div and insert each definition into the "meanings" div
      insertWordMeaningsDiv(meanings, i, resultsContainer);
      insertDefinitions(meanings, i);

      // Insert 'synonyms-container' if synonyms exist
      insertSynonymsOrAntonyms(
        meanings,
        i,
        "synonyms",
        termsCount,
        capitalizeFirstLetter
      );

      // Insert 'antonyms-container' if antonyms exist
      insertSynonymsOrAntonyms(
        meanings,
        i,
        "antonyms",
        termsCount,
        capitalizeFirstLetter
      );
    }

    // Insert source container
    insertSource(data, word, resultsContainer);
  } catch (error) {
    console.error("Error:", error);
  }
}

// CODE FOR CLICKING ON 'playAudioBtn'
function handlePlayAudioBtnClick(e) {
  const playAudioBtn = e.target.closest(".play-audio-btn");
  if (!playAudioBtn) return;

  // Find the phonetic object where the audio matches the user's language and location
  const phonetic = info.phonetics.find((phonetic) =>
    doesPhoneticAudioMatch(phonetic, language, location)
  );

  const audioURL = phonetic.audio;

  // Set the audio source to the URL
  const audioElement = document.querySelector(".pronunciation-audio");
  audioElement.src = audioURL;

  // Load and play the audio
  audioElement.load();
  audioElement.play();
}

// CODE FOR CLICKING ON A SYNONYM OR ANTONYM
async function handleSynonymOrAntonymClick(e) {
  const target = e.target;
  if (
    !target.classList.contains("synonym") &&
    !target.classList.contains("antonym")
  )
    return;

  const term = target.textContent;

  // Get the definition of the term that was clicked
  await getWordDefinition(e, term);

  // Make the value of the 'formInput' be the term that was clicked and scroll to the top of the page
  formInput.value = term;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// EVENT LISTENERS
form.addEventListener("submit", (e) =>
  getWordDefinition(e, formInput.value.toLowerCase())
);
resultsContainer.addEventListener("click", handlePlayAudioBtnClick);
resultsContainer.addEventListener("click", handleSynonymOrAntonymClick);
