import * as handlers from "./handlers";
import data from "./data";

// @ts-ignore - rollup handles this
import defaultStyles from "./defaultStyles.css";

/**
 * Postcoder Autocomplete Library
 *
 * Attach address autocomplete functionality to an input element on your webpage.
 */
class PostcoderAddressAutocomplete {
  constructor(config: ConstructorArgs) {
    // data.config contains our defaults, ovewrite with any provided config
    const mergedConfigs = { ...data.config, ...config };
    data.config = mergedConfigs;

    data.abortController = null;

    // Set up API Key
    if (data.config.apikey) {
      data.apikey = data.config.apikey;
    } else {
      throw new Error(
        "Postcoder Autocomplete: No API key provided. This is required for address lookup to function. Sign up for a free trial at https://postcoder.com"
      );
    }

    // Add default styles if required
    if (data.config.defaultstyles) {
      const style = document.createElement("style");
      style.textContent = defaultStyles;
      document.head.appendChild(style);
    }

    // Set up search box
    data.input = document.querySelector(data.config.searchinput);
    if (!data.input) {
      throw new Error(
        "Postcoder Autocomplete: No input element found. Please provide a valid query selector for a text input to the searchterm option."
      );
    }

    if (!(data.input instanceof HTMLInputElement)) {
      throw new Error(
        "Postcoder Autocomplete: The input element must be an <input> element. Please provide a valid query selector for a text input to the searchterm option."
      );
    }

    data.input.classList.add("postcoder-input");
    data.input.setAttribute("type", "search");
    data.input.setAttribute("autocomplete", "off");
    data.input.setAttribute("autocapitalize", "off");
    data.input.setAttribute("autocorrect", "off");
    data.input.setAttribute("spellcheck", "false");
    data.input.addEventListener("input", handlers.input);
    data.input.addEventListener("focus", handlers.focus);
    data.input.addEventListener("keydown", handlers.keydown);

    // Set up country select method
    if (!data.config.countrycode && !data.config.country) {
      throw new Error(
        "Postcoder Autocomplete: No country code or country selector provided. Please provide a valid ISO 3166-1 alpha-2 code for the country you wish to search or a query selector for a <select> element."
      );
    }

    // Find the country selector element if provided
    if (data.config.country) {
      data.countrySelectorElement = document.querySelector(data.config.country);
      // If country option is provided, it must be a query selector for a <select> element
      if (!(data.countrySelectorElement instanceof HTMLSelectElement)) {
        throw new Error(
          "Postcoder Autocomplete: The country element must be a <select> element. Please provide a valid query selector for a <select> element to the country option."
        );
      }
    }

    // Build the suggestions list; where we're going to put Find results
    this.setupSuggestionsList();

    // Determine the number of addresslines required
    Object.keys(data.config.outputfields).forEach((key) => {
      if (key.startsWith("addressline")) {
        data.addresslines++;
      }
    });
  }

  /**
   * Construct and attach the element where we'll display
   * the suggestions returned by the FIND endpoint.
   * It should be inserted after the search input element.
   */
  setupSuggestionsList = () => {
    if (!data.input) return;

    const suggestionsElement = document.createElement("ul");
    suggestionsElement.classList.add("postcoder-suggestions-list");

    // Add listener for if the suggestions are clicked
    suggestionsElement.addEventListener("click", handlers.suggestionClick);

    // Wrap the input in a new div
    const wrapper = document.createElement("div");
    wrapper.classList.add("postcoder-wrapper");
    data.input.parentNode!.insertBefore(wrapper, data.input.nextSibling);
    wrapper.appendChild(data.input);

    // Put the suggestions in there with the input
    wrapper.appendChild(suggestionsElement);

    // Add click event listener to the document, to hide the suggestions when clicked away
    document.body.addEventListener("click", handlers.documentClick);

    // Store the reference to the suggestions element
    data.suggestionlist = suggestionsElement;
  };
}

window.PostcoderAddressAutocomplete = PostcoderAddressAutocomplete;
