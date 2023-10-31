import newWindowIcon from "url:./assets/images/icon-new-window.svg";
import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const resultsContainer = document.querySelector(".results-container");
const { language, location } = getLanguageAndLocation();
let data;
let phonetics;
let audioElement;
let synonymsCount = -1;
let antonymsCount = -1;

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

  const phoneticValue = phonetic?.text || "";

  return phoneticValue;
}

function isAudioAvailable(phonetics) {
  // for (let phonetic of phonetics) {
  //   if (doesPhoneticAudioMatch(phonetic, language, location)) return true;
  // }
  // const phonetic = phonetics.find((phonetic) =>
  //   doesPhoneticAudioMatch(phonetic, language, location)
  // );
  // return phonetic || false;
  // return false;
}

// EVENT LISTENER CALLBACK FUNCTION
async function handleFormSubmit(e) {
  e.preventDefault();
  const word = formInput.value;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
      // Error handling for empty string and not a word goes here:
    }

    data = await response.json();
    // Have to remove this console.log
    console.log(data);

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

      audioElement = document.querySelector(".pronunciation-audio");
      playAudioBtn = document.querySelector(".play-audio-btn");
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
    const sourceLink = data[0].sourceUrls[0];
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
form.addEventListener("submit", handleFormSubmit);

// CODE FOR CLICKING ON 'playAudioBtn'

// EVENT LISTENER CALLBACK FUNCTION
function handlePlayAudioBtnClick(e) {
  const playAudioBtn = e.target.closest(".play-audio-btn");
  if (!playAudioBtn) return;

  let audioURL;
  for (let phonetic of phonetics) {
    if (doesPhoneticAudioMatch(phonetic, language, location)) {
      audioURL = phonetic.audio;
      break;
    }
  }

  // Set the audio source to the URL
  audioElement.src = audioURL;

  // Load and play the audio
  audioElement.load();
  audioElement.play();
}

// EVENT LISTENER
resultsContainer.addEventListener("click", handlePlayAudioBtnClick);
