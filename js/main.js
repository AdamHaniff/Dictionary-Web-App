import newWindowIcon from "url:../assets/images/icon-new-window.svg";
import isLightTheme from "./color-themes";
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

// CODE FOR GETTING WORD DEFINITION

// HELPER FUNCTIONS
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

function getPhonetic(phonetics) {
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

function isAudioAvailable(phonetics) {
  return phonetics.some((phonetic) =>
    doesPhoneticAudioMatch(phonetic, language, location)
  );
}

function hideLoadingSpinner() {
  loadingSpinner.classList.add("hidden");
}

function displayLoadingSpinner() {
  loadingSpinner.classList.remove("hidden");
}

function displayFormInputError() {
  hideLoadingSpinner();

  // Remove focus from 'formInput'
  formInput.blur();

  // Turn the border of 'formInput' red
  formInput.classList.add("form__input--red");

  // Display 'form__input-error'
  formInputError.classList.remove("hidden");

  // Hide 'notFound' div if it is currently being displayed
  notFound.classList.add("hidden");
}

function hideFormInputError() {
  // Remove 'form__input--red' class from 'formInput' if it is present.
  formInput.classList.remove("form__input--red");

  // Hide 'formInputError' if it is currently being displayed.
  formInputError.classList.add("hidden");
}

function displayNotFoundDiv() {
  hideLoadingSpinner();

  // Remove focus from 'formInput'
  formInput.blur();

  hideFormInputError();

  // If there is a definition currenty being displayed, it needs to be removed.
  resultsContainer.innerHTML = "";

  // Display the 'notFound' div
  notFound.classList.remove("hidden");
}

// EVENT LISTENER CALLBACK FUNCTION
async function getWordDefinition(e, word) {
  e.preventDefault();

  try {
    displayLoadingSpinner();

    // Remove focus from 'formInput'
    formInput.blur();

    // Remove definition if it is currently being displayed
    resultsContainer.innerHTML = "";

    // Hide 'formInputError' if it is currently displayed
    hideFormInputError();

    // Hide 'notFound' div if it is currently displayed
    notFound.classList.add("hidden");

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      if (word === "") {
        displayFormInputError();
        return;
      }

      // If a word doesn't exist, we will also get an error. In this scenario we want to display the 'not-found' div.
      displayNotFoundDiv();

      throw new Error("Network response was not ok");
    }

    // CODE FOR WHEN WE GET BACK A VALID RESPONSE

    // Initialize 'synonymsCount' and 'antonymsCount' with a value of -1
    let synonymsCount = -1;
    let antonymsCount = -1;

    // Retrieve data
    data = await response.json();

    // Have to remove this console.log
    console.log(data);

    hideLoadingSpinner();

    // Generate and insert HTML based on the data
    phonetics = data[0].phonetics;
    resultsContainer.innerHTML = `
    <div class="word-phonetic-audio-container">
      <div class="word-phonetic-container">
        <span class="word">${data[0].word}</span>
        <span class="phonetic">${getPhonetic(phonetics)}</span>
      </div>
    </div>`;

    // Check if audio pronunciation is available
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

    if (isAudioAvailable(phonetics)) {
      const wordPhoneticAudioContainer = document.querySelector(
        ".word-phonetic-audio-container"
      );

      wordPhoneticAudioContainer.insertAdjacentHTML(
        "beforeend",
        playAudioBtnHTML
      );
    }

    // Insert 'word-meanings' div based on how many meanings there are
    const meanings = data[0].meanings;

    for (let i = 0; i < meanings.length; i++) {
      const wordMeaningsHTML = `
      <div class="word-meanings">
        <div class="part-of-speech-line-container">
          <span class="part-of-speech">${meanings[i].partOfSpeech}</span>
          <hr class="horizontal-line" />
        </div>
        <span class="meaning-text">Meaning</span>
        <div class="meanings"></div>
      </div>`;

      resultsContainer.insertAdjacentHTML("beforeend", wordMeaningsHTML);

      // Insert each definition into the "meanings" div
      const definitions = meanings[i].definitions;
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
            <p class="word-meaning">
             ${definition.definition}
            </p>
            ${
              definition.hasOwnProperty("example")
                ? `<p class="word-example">“${definition.example}”</p>`
                : ""
            }
          </div>
        </div>`;

        const meaningsDiv = document.querySelectorAll(".meanings")[i];
        meaningsDiv.insertAdjacentHTML("beforeend", bulletMeaningContainerHTML);
      }

      // Insert 'synonyms-container' if synonyms exist
      const synonyms = meanings[i].synonyms;

      if (synonyms.length > 0) {
        synonymsCount++;
        const synonymsContainerHTML = `
        <div class="synonyms-container">
          <span class="synonyms-text">Synonyms</span>
          <div class="synonyms"></div>
        </div>`;

        const wordMeaningsDiv = document.querySelectorAll(".word-meanings")[i];
        wordMeaningsDiv.insertAdjacentHTML("beforeend", synonymsContainerHTML);

        // Loop over the 'synonyms' array and add each synonym to the 'synonyms' div
        const synonymsDiv =
          document.querySelectorAll(".synonyms")[synonymsCount];
        for (let synonym of synonyms) {
          const synonymHTML = `
          <span class="synonym">${synonym}</span>
          `;

          synonymsDiv.insertAdjacentHTML("beforeend", synonymHTML);
        }
      }

      // Insert 'antonyms-container' if antonyms exist
      const antonyms = meanings[i].antonyms;

      if (antonyms.length > 0) {
        antonymsCount++;
        const antonymsContainerHTML = `
        <div class="antonyms-container">
          <span class="antonyms-text">Antonyms</span>
          <div class="antonyms"></div>
        </div>`;

        const wordMeaningsDiv = document.querySelectorAll(".word-meanings")[i];
        wordMeaningsDiv.insertAdjacentHTML("beforeend", antonymsContainerHTML);

        // Loop over the 'antonyms' array and add each antonym to the 'antonyms' div
        const antonymsDiv =
          document.querySelectorAll(".antonyms")[antonymsCount];
        for (let antonym of antonyms) {
          const antonymHTML = `
          <span class="antonym">${antonym}</span>
          `;

          antonymsDiv.insertAdjacentHTML("beforeend", antonymHTML);
        }
      }
    }

    // Insert source container
    const sourceUrls = data[0].sourceUrls;
    const sourceLink = sourceUrls.find((url) => url.includes(`/${word}`));
    const sourceContainerHTML = `
    <div class="source">
      <span class="source__text">Source</span>
      <div class="source__link-window">
        <a
          class="source__link"
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
