import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const resultsContainer = document.querySelector(".results-container");

// FUNCTIONS
function isAudioAvailable(phonetics) {
  for (let phonetic of phonetics) {
    if (phonetic.audio) return true;
  }

  return false;
}

// EVENT LISTENER CALLBACK FUNCTIONS
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

    const data = await response.json();
    // Have to remove this console.log
    console.log(data);

    // Generate and insert HTML based on the data
    resultsContainer.innerHTML = `
    <div class="word-phonetic-audio-container">
      <div class="word-phonetic-container">
        <span class="word">${data[0].word}</span>
        <span class="phonetic">${data[0].phonetic}</span>
      </div>
    </div>`;

    // Check if audio pronunciation is available
    const phonetics = data[0].phonetics;
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

      // Insert 'related-terms-container' if synonyms exist
      const synonyms = meanings[i].synonyms;
      const antonyms = meanings[i].antonyms;

      if (synonyms.length > 0) {
        const synonymsHTML = `
        <div class="related-terms-container">
          <span class="related-terms-text">Synonyms</span>
          <div class="related-terms"></div>
        </div>`;

        const wordMeaningsDiv = document.querySelectorAll(".word-meanings")[i];
        wordMeaningsDiv.insertAdjacentHTML("beforeend", synonymsHTML);

        // Loop over the 'synonyms' array and add each synonym to the 'related-terms' div
        const relatedTermsDiv = document.querySelectorAll(".related-terms")[0];
        for (let synonym of synonyms) {
          const relatedTermHTML = `
          <span class="related-term">${synonym}</span>
          `;

          relatedTermsDiv.insertAdjacentHTML("beforeend", relatedTermHTML);
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// EVENT LISTENERS
form.addEventListener("submit", handleFormSubmit);
