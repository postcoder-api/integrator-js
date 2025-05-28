import data from "./data";

export const selectSuggestion = (target: Element) => {
  const dataTypeAttribute = target.getAttribute("data-type");
  const dataIdAttribute = target.getAttribute("data-id");

  if (dataIdAttribute == null) return;

  if (dataTypeAttribute === "BACK") {
    // Back to original address
    data.facetselected = false;
    data.pathfilter = "";
    getSuggestions();
  } else if (dataTypeAttribute === "ADD") {
    // If the type is an address, retrieve it using the id
    retrieve(dataIdAttribute);
  } else {
    // Get more suggestions, using the id
    data.pathfilter = dataIdAttribute.toString();
    data.facetselected = true;
    getSuggestions();
  }
};

/**
 * Having received suggestions from the API's find method,
 * show them in the suggestions list. Also fired when the search
 * input receives focus.
 */
export const showSuggestions = () => {
  if (!data.suggestionlist) {
    return;
  }

  data.suggestionlist.style.display = "block";

  if (data.suggestions.length === 0) {
    // Show no results message in ul
    let option = document.createElement("li");
    option.classList.add("postcoder-suggestion");
    option.classList.add("postcoder-no-results");
    option.innerHTML = data.no_results_message;
    data.suggestionlist.appendChild(option);
    data.facetselected = false;
    data.pathfilter = "";
  } else {
    for (let i = 0; i < data.suggestions.length; i++) {
      let option = document.createElement("li");
      option.classList.add("postcoder-suggestion");

      let suggestiontext = "";

      suggestiontext = data.suggestions[i].summaryline;

      if (data.suggestions[i].count > 1) {
        let count =
          data.suggestions[i].count > 100 ? "100+" : data.suggestions[i].count;

        suggestiontext +=
          ' <span class="postcoder-extra-info">(' +
          count +
          " addresses)</span>";
      }

      option.innerHTML = suggestiontext;

      // Add the id and type attibutes to the option
      option.setAttribute("data-id", data.suggestions[i].id);
      option.setAttribute("data-type", data.suggestions[i].type);

      data.suggestionlist!.appendChild(option);
    }

    // If a facet is selected, have an option to go back at the top of the list
    if (data.facetselected) {
      // Check if the back option already exists
      let backOption = data.suggestionlist.querySelector(
        'li[data-type="BACK"]'
      );
      if (backOption) {
        // Don't add it again
        return;
      } else {
        console.log("Adding back option");
        let option = document.createElement("li");
        option.classList.add("postcoder-suggestion");
        option.classList.add("postcoder-facet-back");
        option.innerHTML = "↩ Back";
        option.setAttribute("data-type", "BACK");
        option.setAttribute("data-id", "0");

        // Add to start of the list
        data.suggestionlist!.insertBefore(
          option,
          data.suggestionlist!.firstChild
        );
      }
    }
  }
};

/**
 * When we've selected a suggestion from the FIND endpoint,
 * go to the RETRIEVE endpoint to get the full address details
 * @param id
 */
export const retrieve = (id: number | string) => {
  const country = getCountry();

  const url =
    data.retrieveEndpoint +
    "?apikey=" +
    data.apikey +
    "&country=" +
    country +
    "&query=" +
    data.searchterm +
    "&id=" +
    id +
    "&lines=" +
    data.addresslines +
    "&identifier=" +
    encodeURIComponent(data.config.identifier) +
    "&exclude=" +
    excludeFields();

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
      processResult(addresses[0]);
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
};

/**
 * When we have a search term to go on,
 * get suggestions from the FIND endpoint.
 */
export const getSuggestions = () => {
  data.searchterm = encodeURIComponent(data.input!.value.trim());

  // If it has been cleared, completely remove the suggestions
  if (data.searchterm === "") {
    newSuggestionsReset();
    return;
  }

  // Require a minimum of three characters to perform an address search
  if (data.searchterm.length < 3) {
    hideSuggestions();
    return;
  }

  let url =
    data.suggestionEndpoint +
    "?apikey=" +
    data.apikey +
    "&country=" +
    getCountry() +
    "&singlesummary=true" +
    "&query=" +
    data.searchterm;

  if (data.pathfilter) {
    url += "&pathfilter=" + encodeURIComponent(data.pathfilter);
  }

  if (data.config.usercategory) {
    url += "&usercategory=" + data.config.usercategory;
  }

  if (data.config.postcode) {
    url += "&postcode=" + data.config.postcode;
  }

  if (data.config.enablefacets) {
    url += "&enablefacets=" + data.config.enablefacets;
  }

  if (data.config.maximumresults) {
    url += "&maximumresults=" + data.config.maximumresults;
  }

  data.abortController = new AbortController();
  fetch(url, { signal: data.abortController.signal })
    .then((response) => {
      if (!response.ok) {
        throw response;
      }
      return response.json();
    })
    .then((json) => {
      // Clear old suggestions
      newSuggestionsReset();
      // Add new ones
      data.suggestions = json;
      showSuggestions();
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
};

/**
 * Hide the suggestions list, for use when clicking
 * away from the input field for example
 */
export const hideSuggestions = () => {
  if (!data.suggestionlist) return;
  // Clear the ul list
  data.suggestionlist.innerHTML = "";
  // Hide it
  data.suggestionlist.style.display = "none";
};

/**
 * Removes the previous suggestions and resets the suggestions list.
 */
export const newSuggestionsReset = () => {
  // Hide the list while we work on it
  hideSuggestions();
  // Clear the filter we would pass to RETRIEVE if a selection is made
  data.pathfilter = "";
  // Clear the list
  data.suggestions = [];
  // Scroll to top
  data.suggestionlist!.scrollTop = 0;
  // Reset the index for the arrow key navigation
  data.selectedIndex = -1;
};

/**
 * Gets a country code to use for the address search, whether
 * that is from the config object or from the country selector.
 */
export const getCountry = (): string => {
  // If the countrycode is provided via config object, use that.
  // If not, use html input
  return typeof data.config.countrycode !== "undefined" &&
    data.config.countrycode !== ""
    ? data.config.countrycode
    : data.countrySelectorElement!.value;
};

/**
 * After an address suggestion has been selected and the full address
 * returned from RETRIEVE, we need to populate the form fields with the
 * address details.
 * @param address The full address object returned from RETRIEVE
 */
export const processResult = (address: any) => {
  hideSuggestions();
  data.facetselected = false;
  newSuggestionsReset();

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
    let field_selector = data.config.outputfields[possibleFields[i]];

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
};

/**
 * Use Postcoder's ipaddress endpoint to pre-select the country list
 */
export const preselectCountry = () => {
  if (data.config.geolocate) {
    fetch("https://ws.postcoder.com/pcw/" + data.apikey + "/ipaddress")
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((json) => {
        // Make our selection
        data.countrySelectorElement!.value = json.countrycode;
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
};

/**
 * Return a comma separated list of fields to exclude from the RETRIEVE endpoint.
 * This is used to exclude fields from the addresslines outputs; for example
 * where you have your own organisation field.
 */
const excludeFields = (): string => {
  // If an organisation field is provided in the constructor, don't include it in the addresslines
  const organisationField = data.config.outputfields["organisation"];

  if (organisationField === "" || organisationField === undefined) {
    return "posttown,county,postcode,country";
  } else {
    return "organisation,posttown,county,postcode,country";
  }
};
