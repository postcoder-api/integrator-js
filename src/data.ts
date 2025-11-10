const defaultConfig: ConstructorArgs = {
  apikey: "",
  searchinput: "",
  outputfields: {
    addressline1: "",
  },
  defaultstyles: true,
  geolocate: false,
  identifier: "Postcoder Integrator",
};

const initialData: LibraryProperties = {
  abortController: null,
  addresslines: 0,
  apikey: "",
  config: {
    ...defaultConfig,
  },
  countrySelectorElement: null,
  debounce: 0,
  facetselected: false,
  input: null,
  inputdelay: 50,
  no_results_message: "No addresses found",
  pathfilter: "",
  retrieveEndpoint: "https://ws.postcoder.com/pcw/autocomplete/retrieve",
  searchinput: "",
  searchterm: "",
  selectedIndex: -1,
  suggestionEndpoint: "https://ws.postcoder.com/pcw/autocomplete/find",
  suggestionlist: null,
  suggestions: [],
};

export default initialData;
