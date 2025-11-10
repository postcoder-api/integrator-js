import PostcoderAddressAutocomplete from "./index";

export function selectSuggestion(
  this: PostcoderAddressAutocomplete,
  target: Element
) {
  const dataTypeAttribute = target.getAttribute("data-type");
  const dataIdAttribute = target.getAttribute("data-id");

  if (dataIdAttribute == null) return;

  if (dataTypeAttribute === "BACK") {
    // Back to original address
    this.data.facetselected = false;
    this.data.pathfilter = "";
    getSuggestions.call(this);
  } else if (dataTypeAttribute === "ADD") {
    // If the type is an address, retrieve it using the id
    retrieve.call(this, dataIdAttribute);
  } else {
    // Get more suggestions, using the id
    this.data.pathfilter = dataIdAttribute.toString();
    this.data.facetselected = true;
    getSuggestions.call(this);
  }
}

/**
 * Having received suggestions from the API's find method,
 * show them in the suggestions list. Also fired when the search
 * input receives focus.
 */
export function showSuggestions(this: PostcoderAddressAutocomplete) {
  if (!this.data.suggestionlist) {
    return;
  }

  this.data.suggestionlist.style.display = "block";

  if (this.data.suggestions.length === 0) {
    // Show no results message in ul
    let option = document.createElement("li");
    option.classList.add("postcoder-suggestion");
    option.classList.add("postcoder-no-results");
    option.innerHTML = this.data.no_results_message;
    this.data.suggestionlist.appendChild(option);
    this.data.facetselected = false;
    this.data.pathfilter = "";
  } else {
    for (let i = 0; i < this.data.suggestions.length; i++) {
      let option = document.createElement("li");
      option.classList.add("postcoder-suggestion");

      let suggestiontext = "";

      suggestiontext = this.data.suggestions[i].summaryline;

      if (this.data.suggestions[i].count > 1) {
        let count =
          this.data.suggestions[i].count > 100
            ? "100+"
            : this.data.suggestions[i].count;

        suggestiontext +=
          ' <span class="postcoder-extra-info">(' +
          count +
          " addresses)</span>";
      }

      option.innerHTML = suggestiontext;

      // Add the id and type attibutes to the option
      option.setAttribute("data-id", this.data.suggestions[i].id);
      option.setAttribute("data-type", this.data.suggestions[i].type);

      this.data.suggestionlist!.appendChild(option);
    }

    // If a facet is selected, have an option to go back at the top of the list
    if (this.data.facetselected) {
      // Check if the back option already exists
      let backOption = this.data.suggestionlist.querySelector(
        'li[data-type="BACK"]'
      );
      if (backOption) {
        // Don't add it again
        return;
      } else {
        let option = document.createElement("li");
        option.classList.add("postcoder-suggestion");
        option.classList.add("postcoder-facet-back");
        option.innerHTML = "↩ Back";
        option.setAttribute("data-type", "BACK");
        option.setAttribute("data-id", "0");

        // Add to start of the list
        this.data.suggestionlist!.insertBefore(
          option,
          this.data.suggestionlist!.firstChild
        );
      }
    }
  }
}

/**
 * When we've selected a suggestion from the FIND endpoint,
 * go to the RETRIEVE endpoint to get the full address details
 * @param id
 */
export function retrieve(
  this: PostcoderAddressAutocomplete,
  id: number | string
) {
  const country = getCountry.call(this);

  const url =
    this.data.retrieveEndpoint +
    "?apikey=" +
    this.data.apikey +
    "&country=" +
    country +
    "&query=" +
    this.data.searchterm +
    "&id=" +
    id +
    "&lines=" +
    this.data.addresslines +
    "&identifier=" +
    encodeURIComponent(this.data.config.identifier) +
    "&exclude=" +
    excludeFields.call(this);

  // Fetch the json formatted result from Postcoder and pass it to processResult
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((addresses) => {
      // Always one result, use the first array item
      processResult.call(this, addresses[0]);
    })
    .catch((err) => {
      if (typeof err.text === "function") {
        err.text().then((errorMessage: string) => {
          console.log(
            "Postcoder request error " + err.status + " : " + errorMessage
          );
        });
      } else {
        console.log(err);
      }
    });
}

/**
 * When we have a search term to go on,
 * get suggestions from the FIND endpoint.
 */
export function getSuggestions(this: PostcoderAddressAutocomplete) {
  this.data.searchterm = encodeURIComponent(this.data.input!.value.trim());

  // If it has been cleared, completely remove the suggestions
  if (this.data.searchterm === "") {
    newSuggestionsReset.call(this);
    return;
  }

  // Require a minimum of three characters to perform an address search
  if (this.data.searchterm.length < 3) {
    hideSuggestions.call(this);
    return;
  }

  let url =
    this.data.suggestionEndpoint +
    "?apikey=" +
    this.data.apikey +
    "&country=" +
    getCountry.call(this) +
    "&singlesummary=true" +
    "&query=" +
    this.data.searchterm;

  if (this.data.pathfilter) {
    url += "&pathfilter=" + encodeURIComponent(this.data.pathfilter);
  }

  if (this.data.config.usercategory) {
    url += "&usercategory=" + this.data.config.usercategory;
  }

  if (this.data.config.postcode) {
    url += "&postcode=" + this.data.config.postcode;
  }

  if (this.data.config.enablefacets) {
    url += "&enablefacets=" + this.data.config.enablefacets;
  }

  if (this.data.config.maximumresults) {
    url += "&maximumresults=" + this.data.config.maximumresults;
  }

  this.data.abortController = new AbortController();
  fetch(url, { signal: this.data.abortController.signal })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      // Clear old suggestions
      newSuggestionsReset.call(this);
      // Add new ones
      this.data.suggestions = json;
      showSuggestions.call(this);
    })
    .catch((err) => {
      if (typeof err.text === "function") {
        err.text().then((errorMessage: string) => {
          console.log(
            "Postcoder request error " + err.status + " : " + errorMessage
          );
        });
      } else {
        console.log(err);
      }
    });
}

/**
 * Hide the suggestions list, for use when clicking
 * away from the input field for example
 */
export function hideSuggestions(this: PostcoderAddressAutocomplete) {
  if (!this.data.suggestionlist) return;
  // Clear the ul list
  this.data.suggestionlist.innerHTML = "";
  // Hide it
  this.data.suggestionlist.style.display = "none";
}

/**
 * Removes the previous suggestions and resets the suggestions list.
 */
export function newSuggestionsReset(this: PostcoderAddressAutocomplete) {
  // Hide the list while we work on it
  hideSuggestions.call(this);
  // Clear the filter we would pass to RETRIEVE if a selection is made
  this.data.pathfilter = "";
  // Clear the list
  this.data.suggestions = [];
  // Scroll to top
  this.data.suggestionlist!.scrollTop = 0;
  // Reset the index for the arrow key navigation
  this.data.selectedIndex = -1;
}

/**
 * Gets a country code to use for the address search, whether
 * that is from the config object or from the country selector.
 */
export function getCountry(this: PostcoderAddressAutocomplete): string {
  // If the countrycode is provided via config object, use that.
  // If not, use html input
  return typeof this.data.config.countrycode !== "undefined" &&
    this.data.config.countrycode !== ""
    ? this.data.config.countrycode
    : this.data.countrySelectorElement!.value;
}

/**
 * After an address suggestion has been selected and the full address
 * returned from RETRIEVE, we need to populate the form fields with the
 * address details.
 * @param address The full address object returned from RETRIEVE
 */
export function processResult(
  this: PostcoderAddressAutocomplete,
  address: any
) {
  hideSuggestions.call(this);
  this.data.facetselected = false;
  newSuggestionsReset.call(this);

  let possibleFields = [
    "organisation",
    "addressline1",
    "addressline2",
    "addressline3",
    "addressline4",
    "addressline5",
    "addressline6",
    "addressline7",
    "addressline8",
    "addressline9",
    "posttown",
    "county",
    "postcode",
  ] as const;

  // Populate the address form
  for (let i = 0; i < possibleFields.length; i++) {
    // See what selectors have been provided
    let field_selector = this.data.config.outputfields[possibleFields[i]];

    // If it's a string, try and use it to find the element
    if (typeof field_selector == "string" && field_selector !== "") {
      let element = document.querySelector(field_selector);

      // If we found the element, set its value
      if (element instanceof HTMLInputElement) {
        element.value =
          typeof address[possibleFields[i]] !== "undefined"
            ? address[possibleFields[i]]
            : "";
      }
    }
  }
}

/**
 * Use Postcoder's ipaddress endpoint to pre-select the country list
 */
export function preselectCountry(this: PostcoderAddressAutocomplete) {
  if (this.data.config.geolocate) {
    fetch("https://ws.postcoder.com/pcw/" + this.data.apikey + "/ipaddress")
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // Make our selection
        this.data.countrySelectorElement!.value = json.countrycode;
      })
      .catch((err) => {
        if (typeof err.text === "function") {
          err.text().then((errorMessage: string) => {
            console.error(
              "Postcoder ipaddress endpoint request error " +
                err.status +
                " : " +
                errorMessage
            );
          });
        } else {
          console.log(err);
        }
      });
  }
}

/**
 * Return a comma separated list of fields to exclude from the RETRIEVE endpoint.
 * This is used to exclude fields from the addresslines outputs; for example
 * where you have your own organisation field.
 */
function excludeFields(this: PostcoderAddressAutocomplete): string {
  // If an organisation field is provided in the constructor, don't include it in the addresslines
  const organisationField = this.data.config.outputfields["organisation"];

  if (organisationField === "" || organisationField === undefined) {
    return "posttown,county,postcode,country";
  } else {
    return "organisation,posttown,county,postcode,country";
  }
}
