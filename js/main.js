import {
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
} from "./helpers";
import {
  insertWordPhoneticAudioContainer,
  insertPlayAudioBtn,
  insertWordMeaningsDiv,
  insertDefinitions,
  insertSynonymsOrAntonyms,
} from "./insert-HTML";
import newWindowIcon from "url:../assets/images/icon-new-window.svg";
import colorTheme from "./color-themes";
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
let data;
let meanings;
const info = { phonetics: undefined };
const termsCount = { synonymsCount: -1, antonymsCount: -1 };

// FUNCTIONS
function resetState() {
  displayLoadingSpinner(loadingSpinner);

  // Remove focus from 'formInput'
  formInput.blur();

  // Remove definition if it is currently being displayed
  resultsContainer.innerHTML = "";

  // Hide 'formInputError' if it is currently displayed
  hideFormInputError(formInput, formInputError);

  // Hide 'notFound' div if it is currently displayed
  notFound.classList.add("hidden");

  // Reset 'synonymsCount' and 'antonymsCount' back to -1
  termsCount.synonymsCount = -1;
  termsCount.antonymsCount = -1;
}

function insertSource(data, word) {
  const sourceUrls = data[0].sourceUrls;
  const sourceLink = sourceUrls.find((url) => url.includes(`/${word}`));
  const sourceContainerHTML = `
<div class="source ${colorTheme.isLightTheme ? "" : "source--dark"}">
  <span class="source__text">Source</span>
  <div class="source__link-window">
    <a
      class="source__link ${
        colorTheme.isLightTheme ? "" : "source__link--dark"
      }"
      href="${sourceLink}"
      target="_blank"
      >${sourceLink}</a
    >
    <a
      class="source__new-window-link"
      href="${sourceLink}"
      target="_blank"
    >
      <img
        class="source__new-window-icon"
        src=${newWindowIcon}
        alt="New window icon"
      />
    </a>
  </div>
</div>`;

  resultsContainer.insertAdjacentHTML("beforeend", sourceContainerHTML);
}

// EVENT LISTENER CALLBACK FUNCTION
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
    hideLoadingSpinner(loadingSpinner);

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
    insertSource(data, word);
  } catch (error) {
    console.error("Error:", error);
  }
}

// EVENT LISTENER
form.addEventListener("submit", (e) =>
  getWordDefinition(e, formInput.value.toLowerCase())
);

// CODE FOR CLICKING ON 'playAudioBtn'

// EVENT LISTENER CALLBACK FUNCTION
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

// EVENT LISTENER
resultsContainer.addEventListener("click", handlePlayAudioBtnClick);

// CODE FOR CLICKING ON A SYNONYM OR ANTONYM

// EVENT LISTENER CALLBACK FUNCTION
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

// EVENT LISTENER
resultsContainer.addEventListener("click", handleSynonymOrAntonymClick);
