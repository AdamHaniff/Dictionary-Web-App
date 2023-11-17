import newWindowIcon from "url:../assets/images/icon-new-window.svg";
import colorTheme from "./color-themes";

// FUNCTIONS
function insertWordPhoneticAudioContainer(
  data,
  info,
  resultsContainer,
  getPhonetic,
  language,
  location
) {
  info.phonetics = data[0].phonetics;
  resultsContainer.innerHTML = `
    <div class="word-phonetic-audio-container">
      <div class="word-phonetic-container">
        <span class="word ${colorTheme.isLightTheme ? "" : "dark"}">${
    data[0].word
  }</span>
        <span class="phonetic">${getPhonetic(
          info.phonetics,
          language,
          location,
          data
        )}</span>
      </div>
    </div>`;
}

function insertPlayAudioBtn(isAudioAvailable, info, language, location) {
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

  if (isAudioAvailable(info.phonetics, language, location)) {
    const wordPhoneticAudioContainer = document.querySelector(
      ".word-phonetic-audio-container"
    );

    wordPhoneticAudioContainer.insertAdjacentHTML(
      "beforeend",
      playAudioBtnHTML
    );
  }
}

function insertWordMeaningsDiv(meanings, index, resultsContainer) {
  const wordMeaningsHTML = `
      <div class="word-meanings">
        <div class="part-of-speech-line-container">
          <span class="part-of-speech ${
            colorTheme.isLightTheme ? "" : "dark"
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
            <p class="word-meaning ${colorTheme.isLightTheme ? "" : "dark"}">
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

function insertSynonymsOrAntonyms(
  meanings,
  index,
  termType,
  termsCount,
  capitalizeFirstLetter
) {
  const terms = meanings[index][termType];

  if (terms.length > 0) {
    termType === "synonyms"
      ? termsCount.synonymsCount++
      : termsCount.antonymsCount++;

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
      termsDiv = document.querySelectorAll(`.${termType}`)[
        termsCount.synonymsCount
      ];
    } else {
      termsDiv = document.querySelectorAll(`.${termType}`)[
        termsCount.antonymsCount
      ];
    }

    for (let term of terms) {
      const termHTML = `
        <span class="${termType.slice(0, -1)}">${term}</span>
      `;

      termsDiv.insertAdjacentHTML("beforeend", termHTML);
    }
  }
}

function insertSource(data, word, resultsContainer) {
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

export {
  insertWordPhoneticAudioContainer,
  insertPlayAudioBtn,
  insertWordMeaningsDiv,
  insertDefinitions,
  insertSynonymsOrAntonyms,
  insertSource,
};
