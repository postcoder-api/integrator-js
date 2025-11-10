import * as handlers from "./handlers";
import initialData from "./data";

// @ts-ignore - rollup handles this
import defaultStyles from "./defaultStyles.css";

/**
 * Postcoder Autocomplete Library
 *
 * Attach address autocomplete functionality to an input element on your webpage.
 */
class PostcoderAddressAutocomplete {
  data: LibraryProperties;

  constructor(config: ConstructorArgs) {
    this.data = structuredClone(initialData);

    // data.config contains our defaults, ovewrite with any provided config
    const mergedConfigs = { ...this.data.config, ...config };
    this.data.config = mergedConfigs;

    this.data.abortController = null;

    // Set up API Key
    if (this.data.config.apikey) {
      this.data.apikey = this.data.config.apikey;
    } else {
      throw new Error(
        "Postcoder Autocomplete: No API key provided. This is required for address lookup to function. Sign up for a free trial at https://postcoder.com"
      );
    }

    // Add default styles if required
    if (this.data.config.defaultstyles) {
      const style = document.createElement("style");
      style.textContent = defaultStyles;
      document.head.appendChild(style);
    }

    // Set up search box
    this.data.input = document.querySelector(this.data.config.searchinput);

    if (!this.data.input) {
      throw new Error(
        "Postcoder Autocomplete: No input element found. Please provide a valid query selector for a text input to the searchterm option."
      );
    }

    if (!(this.data.input instanceof HTMLInputElement)) {
      throw new Error(
        "Postcoder Autocomplete: The input element must be an <input> element. Please provide a valid query selector for a text input to the searchterm option."
      );
    }

    // Add attributes to the input element
    this.data.input.classList.add("postcoder-input");
    this.data.input.setAttribute("type", "search");
    this.data.input.setAttribute("autocomplete", "off");
    this.data.input.setAttribute("autocapitalize", "off");
    this.data.input.setAttribute("autocorrect", "off");
    this.data.input.setAttribute("spellcheck", "false");

    // Add event listeners to the input element
    this.data.input.addEventListener("input", () => {
      return handlers.input.call(this);
    });
    this.data.input.addEventListener("focus", () => {
      return handlers.focus.call(this);
    });
    this.data.input.addEventListener("keydown", (e: KeyboardEvent) => {
      return handlers.keydown.call(this, e);
    });

    // Set up country select method
    if (!this.data.config.countrycode && !this.data.config.country) {
      throw new Error(
        "Postcoder Autocomplete: No country code or country selector provided. Please provide a valid ISO 3166-1 alpha-2 code for the country you wish to search or a query selector for a <select> element."
      );
    }

    // Find the country selector element if provided
    if (this.data.config.country) {
      this.data.countrySelectorElement = document.querySelector(
        this.data.config.country
      );
      // If country option is provided, it must be a query selector for a <select> element
      if (!(this.data.countrySelectorElement instanceof HTMLSelectElement)) {
        throw new Error(
          "Postcoder Autocomplete: The country element must be a <select> element. Please provide a valid query selector for a <select> element to the country option."
        );
      }
    }

    // Build the suggestions list; where we're going to put Find results
    this.setupSuggestionsList();

    // Determine the number of addresslines required
    Object.keys(this.data.config.outputfields).forEach((key) => {
      if (key.startsWith("addressline")) {
        this.data.addresslines++;
      }
    });
  }

  /**
   * Construct and attach the element where we'll display
   * the suggestions returned by the FIND endpoint.
   * It should be inserted after the search input element.
   */
  setupSuggestionsList = () => {
    if (!this.data.input) return;

    const suggestionsElement = document.createElement("ul");

    // Add id related to the search input for these suggestions
    suggestionsElement.id =
      "postcoder-suggestions-list-" + this.data.config.searchinput;

    // Class for styling
    suggestionsElement.classList.add("postcoder-suggestions-list");

    // Add listener for if the suggestions are clicked
    suggestionsElement.addEventListener("click", (e: Event) => {
      return handlers.suggestionClick.call(this, e);
    });

    // Wrap the input in a new div
    const wrapper = document.createElement("div");
    wrapper.classList.add("postcoder-wrapper");
    this.data.input.parentNode!.insertBefore(
      wrapper,
      this.data.input.nextSibling
    );
    wrapper.appendChild(this.data.input);

    // Put the suggestions in there with the input
    wrapper.appendChild(suggestionsElement);

    // Add click event listener to the document, to hide the suggestions when clicked away
    document.body.addEventListener("click", (e: MouseEvent) => {
      return handlers.documentClick.call(this, e);
    });

    // Store the reference to the suggestions element
    this.data.suggestionlist = suggestionsElement;
  };
}

window.PostcoderAddressAutocomplete = PostcoderAddressAutocomplete;

export type { PostcoderAddressAutocomplete as default };
