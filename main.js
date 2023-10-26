import "core-js/stable";
import "regenerator-runtime/runtime";

// VARIABLES
const form = document.querySelector(".form");
const formInput = document.querySelector(".form__input");
const resultsContainer = document.querySelector(".results-container");

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
    console.log(data);

    // Generate and insert HTML based on the data
    resultsContainer.innerHTML = ``;
  } catch (error) {
    console.error("Error:", error);
  }
}

// EVENT LISTENERS
form.addEventListener("submit", handleFormSubmit);
