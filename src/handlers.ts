import data from "./data";
import {
  hideSuggestions,
  selectSuggestion,
  getSuggestions,
  showSuggestions,
} from "./actions";

/**
 * What should be done if a suggested address is clicked?
 * We treat that as a selection and call the action
 *
 * @param event Event
 * @returns void
 */
export const suggestionClick = (event: Event) => {
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

  selectSuggestion(target);
};

/**
 * Handle clicks on the document
 * @param event
 */
export const documentClick = (event: MouseEvent) => {
  if (!event.target) return;
  if (
    data.suggestionlist!.contains(event.target as Node) ||
    data.input!.contains(event.target as Node)
  ) {
    return;
  }

  hideSuggestions();
};

export const keydown = (event: KeyboardEvent) => {
  if (!data.suggestionlist) return;
  const { key } = event;

  switch (key) {
    case "Up":
    case "Down":
    case "ArrowUp":
    case "ArrowDown": {
      const selectedIndex =
        key === "ArrowUp" || key === "Up"
          ? data.selectedIndex - 1
          : data.selectedIndex + 1;
      event.preventDefault();
      arrows(selectedIndex);
      break;
    }
    case "Tab": {
      tab(event);
      break;
    }
    case "Enter": {
      selectSuggestion(
        data.suggestionlist.querySelectorAll("li")[data.selectedIndex]
      );
      break;
    }
    case "Esc":
    case "Escape": {
      hideSuggestions();
      break;
    }
    default:
      // All other keys (i.e. typing more)
      data.facetselected = false;
      data.pathfilter = "";
      return;
  }
};

/**
 * Handle arrow key navigation
 * @param selectedIndex
 */
export const arrows = (selectedIndex: number) => {
  if (!data.suggestionlist) return;

  let suggestionsCount = data.suggestions.length;

  // Add one to suggestionsCount if the 'Back' button is present
  if (data.facetselected) {
    suggestionsCount++;
  }

  if (data.suggestionlist.querySelectorAll("li").length > 0) {
    if (data.selectedIndex >= 0) {
      // Clear the previously selected class
      data.suggestionlist
        .querySelectorAll("li")
        [data.selectedIndex].classList.remove("selected");
    }

    // Loop selectedIndex back to first or last result if out of bounds
    data.selectedIndex =
      ((selectedIndex % suggestionsCount) + suggestionsCount) %
      suggestionsCount;

    // Set the selected class
    data.suggestionlist
      .querySelectorAll("li")
      [data.selectedIndex].classList.add("selected");

    // Scroll into view
    data.suggestionlist
      .querySelectorAll("li")
      [data.selectedIndex].scrollIntoView(false);
  }
};

/**
 * Handle tab key navigation
 * @param event
 */
export const tab = (event: KeyboardEvent) => {
  if (data.selectedIndex >= 0) {
    event.preventDefault();
    selectSuggestion(
      data.suggestionlist!.querySelectorAll("li")[data.selectedIndex]
    );
  } else {
    hideSuggestions();
  }
};

/**
 * Handle the search box receiving new inputs
 */
export const input = () => {
  clearTimeout(data.debounce);
  if (data.abortController !== null) {
    data.abortController.abort(
      "Aborted a request to Postcoder because new input was detected."
    );
  }
  data.debounce = setTimeout(() => getSuggestions(), data.inputdelay);
};

/**
 * Handle the search box receiving focus
 */
export const focus = () => {
  if (data.suggestions.length > 0) {
    showSuggestions();
  } else {
    getSuggestions();
  }
};
