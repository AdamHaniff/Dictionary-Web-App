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
} from "./helpers";
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
let phonetics;
let meanings;
let synonymsCount = -1;
let antonymsCount = -1;

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
  synonymsCount = -1;
  antonymsCount = -1;
}

function insertWordPhoneticAudioContainer() {
  phonetics = data[0].phonetics;
  resultsContainer.innerHTML = `
    <div class="word-phonetic-audio-container">
      <div class="word-phonetic-container">
        <span class="word ${colorTheme.isLightTheme ? "" : "word--dark"}">${
    data[0].word
  }</span>
        <span class="phonetic">${getPhonetic(
          phonetics,
          language,
          location,
          data
        )}</span>
      </div>
    </div>`;
}

function insertPlayAudioBtn() {
  const playAudioBtnHTML = `
      <button class="play-audio-btn">
        <svg
          class="play-audio-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="75"
          height="75"
          viewBox="0 0 75 75"
        >
          <g fill="#A445ED" fill-rule="evenodd">
            <circle cx="37.5" cy="37.5" r="37.5" opacity=".25" />
            <path d="M29 27v21l21-10.5z" />
          </g>
        </svg>
        <audio class="pronunciation-audio">
          Your browser does not support the audio element.
        </audio>
      </button>`;

  if (isAudioAvailable(phonetics, language, location)) {
    const wordPhoneticAudioContainer = document.querySelector(
      ".word-phonetic-audio-container"
    );

    wordPhoneticAudioContainer.insertAdjacentHTML(
      "beforeend",
      playAudioBtnHTML
    );
  }
}

function insertWordMeaningsDiv(meanings, index) {
  const wordMeaningsHTML = `
      <div class="word-meanings">
        <div class="part-of-speech-line-container">
          <span class="part-of-speech ${
            colorTheme.isLightTheme ? "" : "part-of-speech--dark"
          }">${meanings[index].partOfSpeech}</span>
          <hr class="horizontal-line ${
            colorTheme.isLightTheme ? "" : "horizontal-line--dark"
          }"/>
        </div>
        <span class="meaning-text">Meaning</span>
        <div class="meanings"></div>
      </div>`;

  resultsContainer.insertAdjacentHTML("beforeend", wordMeaningsHTML);
}

function insertDefinitions(meanings, index) {
  const definitions = meanings[index].definitions;
  for (let definition of definitions) {
    const bulletMeaningContainerHTML = `
        <div class="bullet-meaning-container">
          <svg
            class="bullet-point"
            xmlns="http://www.w3.org/2000/svg"
            width="5"
            height="5"
            viewBox="0 0 5 5"
            fill="none"
          >
            <circle cx="2.5" cy="2.5" r="2.5" fill="#8F19E8" />
          </svg>
          <div class="word-meaning-example">
            <p class="word-meaning ${
              colorTheme.isLightTheme ? "" : "word-meaning--dark"
            }">
             ${definition.definition}
            </p>
            ${
              definition.hasOwnProperty("example")
                ? `<p class="word-example">“${definition.example}”</p>`
                : ""
            }
          </div>
        </div>`;

    const meaningsDiv = document.querySelectorAll(".meanings")[index];
    meaningsDiv.insertAdjacentHTML("beforeend", bulletMeaningContainerHTML);
  }
}

function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function insertSynonymsOrAntonyms(meanings, index, termType) {
  const terms = meanings[index][termType];

  if (terms.length > 0) {
    termType === "synonyms" ? synonymsCount++ : antonymsCount++;

    const termTypeContainerHTML = `
      <div class="${termType}-container">
        <span class="${termType}-text">${capitalizeFirstLetter(termType)}</span>
        <div class="${termType}"></div>
      </div>
      `;

    const wordMeaningsDiv = document.querySelectorAll(".word-meanings")[index];
    wordMeaningsDiv.insertAdjacentHTML("beforeend", termTypeContainerHTML);

    let termsDiv;
    // Loop over the 'terms' array and add each term to the 'terms' div
    if (termType === "synonyms") {
      termsDiv = document.querySelectorAll(`.${termType}`)[synonymsCount];
    } else {
      termsDiv = document.querySelectorAll(`.${termType}`)[antonymsCount];
    }

    for (let term of terms) {
      const termHTML = `
        <span class="${termType.slice(0, -1)}">${term}</span>
      `;

      termsDiv.insertAdjacentHTML("beforeend", termHTML);
    }
  }
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
    insertWordPhoneticAudioContainer();

    // Insert HTML for the 'playAudioBtn' if the audio pronunciation is available.
    insertPlayAudioBtn();

    // Insert 'word-meanings' div based on how many meanings there are.
    meanings = data[0].meanings;

    for (let i = 0; i < meanings.length; i++) {
      // Insert "word-meanings" div and insert each definition into the "meanings" div
      insertWordMeaningsDiv(meanings, i);
      insertDefinitions(meanings, i);

      // Insert 'synonyms-container' if synonyms exist
      insertSynonymsOrAntonyms(meanings, i, "synonyms");

      // Insert 'antonyms-container' if antonyms exist
      insertSynonymsOrAntonyms(meanings, i, "antonyms");
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
  const phonetic = phonetics.find((phonetic) =>
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

  // Clear the 'formInput' and scroll to the top of the page
  formInput.value = "";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// EVENT LISTENER
resultsContainer.addEventListener("click", handleSynonymOrAntonymClick);
