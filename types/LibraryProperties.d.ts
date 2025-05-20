interface LibraryProperties {
  /**
   * User-provided configuration.
   */
  config: ConstructorArgs;
  /**
   * Store the provided API key.
   */
  apikey: string;
  /**
   * Tracks the value of the input field.
   */
  searchterm: string;
  /**
   * The message that will display in the suggestion list when no results are found.
   */
  no_results_message: string;
  /**
   * Element to which the Postcoder API will be bound.
   */
  input: HTMLInputElement | null;
  /**
   * Element used to choose a country to search in.
   */
  countrySelectorElement: HTMLSelectElement | null;
  /**
   * The Find endpoint for the Postcoder API.
   */
  suggestionEndpoint: string;
  /**
   * The Retrieve endpoint for the Postcoder API.
   */
  retrieveEndpoint: string;
  /**
   * Tracks if we're drilling down into a geographical grouping.
   */
  facetselected: boolean;
  /**
   * Query selector for the form element to which the Postcoder API will be bound.
   */
  searchinput: string;
  /**
   * Tracks which suggestion we're on if navigating with the keyboard.
   */
  selectedIndex: number;
  /**
   * Passed to the Find endpoint if we're drilling down into a geographical grouping.
   */
  pathfilter: string;
  /**
   * How many ms do we wait after typing has finished before we search?
   */
  inputdelay: number;
  /**
   * Used to cancel existing requests if a new one is made.
   */
  abortController: AbortController | null;
  /**
   * ID of a previous timeout; used to cancel the previous input delay timeout if more searching occurs.
   */
  debounce: number;
  /** The element where we will display suggestions from the FIND endpoint. */
  suggestionlist: HTMLElement | null;
  /** The array of suggestions from the FIND endpoint. */
  suggestions: any[];
  /**
   * How many address lines are required? This is worked
   * out by the init method based on the number of addresslines
   * present in the constructor.
   */
  addresslines: number;
}
