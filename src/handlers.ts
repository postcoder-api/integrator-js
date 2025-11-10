import {
  hideSuggestions,
  selectSuggestion,
  getSuggestions,
  showSuggestions,
} from "./actions";

import PostcoderAddressAutocomplete from "./index";

/**
 * What should be done if a suggested address is clicked?
 * We treat that as a selection and call the action
 *
 * @param event Event
 * @returns void
 */
export function suggestionClick(
  this: PostcoderAddressAutocomplete,
  event: Event
) {
  event.stopPropagation();

  if (event.target == null || !(event.target instanceof Element)) {
    return;
  }

  // If click was not directly on the <li>, but a child, find the <li> in parent
  let target = event.target;
  while (target.tagName.toLowerCase() !== "li") {
    if (target.parentNode != null && target.parentNode instanceof Element) {
      target = target.parentNode;
    }
  }

  selectSuggestion.call(this, target);
}

/**
 * Handle clicks on the document
 * @param event
 */
export function documentClick(
  this: PostcoderAddressAutocomplete,
  event: MouseEvent
) {
  if (!event.target) return;

  if (
    this.data.suggestionlist!.contains(event.target as Node) ||
    this.data.input!.contains(event.target as Node)
  ) {
    return;
  }

  hideSuggestions.call(this);
}

export function keydown(
  this: PostcoderAddressAutocomplete,
  event: KeyboardEvent
) {
  if (!this.data.suggestionlist) return;
  const { key } = event;

  switch (key) {
    case "Up":
    case "Down":
    case "ArrowUp":
    case "ArrowDown": {
      const selectedIndex =
        key === "ArrowUp" || key === "Up"
          ? this.data.selectedIndex - 1
          : this.data.selectedIndex + 1;
      event.preventDefault();
      arrows.call(this, selectedIndex);
      break;
    }
    case "Tab": {
      tab.call(this, event);
      break;
    }
    case "Enter": {
      selectSuggestion.call(
        this,
        this.data.suggestionlist.querySelectorAll("li")[this.data.selectedIndex]
      );
      break;
    }
    case "Esc":
    case "Escape": {
      hideSuggestions.call(this);
      break;
    }
    default:
      // All other keys (i.e. typing more)
      this.data.facetselected = false;
      this.data.pathfilter = "";
      return;
  }
}

/**
 * Handle arrow key navigation
 * @param selectedIndex
 */
function arrows(this: PostcoderAddressAutocomplete, selectedIndex: number) {
  if (!this.data.suggestionlist) return;

  let suggestionsCount = this.data.suggestions.length;

  // Add one to suggestionsCount if the 'Back' button is present
  if (this.data.facetselected) {
    suggestionsCount++;
  }

  if (this.data.suggestionlist.querySelectorAll("li").length > 0) {
    if (this.data.selectedIndex >= 0) {
      // Clear the previously selected class
      this.data.suggestionlist
        .querySelectorAll("li")
        [this.data.selectedIndex].classList.remove("selected");
    }

    // Loop selectedIndex back to first or last result if out of bounds
    this.data.selectedIndex =
      ((selectedIndex % suggestionsCount) + suggestionsCount) %
      suggestionsCount;

    // Set the selected class
    this.data.suggestionlist
      .querySelectorAll("li")
      [this.data.selectedIndex].classList.add("selected");

    // Scroll into view
    this.data.suggestionlist
      .querySelectorAll("li")
      [this.data.selectedIndex].scrollIntoView(false);
  }
}

/**
 * Handle tab key navigation
 * @param event
 */
export function tab(this: PostcoderAddressAutocomplete, event: KeyboardEvent) {
  if (this.data.selectedIndex >= 0) {
    event.preventDefault();
    selectSuggestion.call(
      this,
      this.data.suggestionlist!.querySelectorAll("li")[this.data.selectedIndex]
    );
  } else {
    hideSuggestions.call(this);
  }
}

/**
 * Handle the search box receiving new inputs
 */
export function input(this: PostcoderAddressAutocomplete) {
  clearTimeout(this.data.debounce);
  if (this.data.abortController !== null) {
    this.data.abortController.abort(
      "Aborted a request to Postcoder because new input was detected."
    );
  }
  this.data.debounce = setTimeout(
    () => getSuggestions.call(this),
    this.data.inputdelay
  );
}

/**
 * Handle the search box receiving focus
 */
export function focus(this: PostcoderAddressAutocomplete) {
  if (this.data.suggestions.length > 0) {
    showSuggestions.call(this);
  } else {
    getSuggestions.call(this);
  }
}
