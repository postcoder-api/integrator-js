type ConstructorArgs = {
  /**
   * An active Postcoder API key must be provided. Sign up for a free trial at https://postcoder.com
   */
  apikey: string;
  /**
   * Query selector for the form element to which the Postcoder API will be bound.
   */
  searchinput: string;
  /**
   * An object containing query selectors for the form elements into which Postcoder will output a selected address.
   */
  outputfields: OutputFields;
  /**
   * Country select list; leave blank if not using a country select list.
   * This should be a query selector for a <select> element which contains a list of countries.
   * The value of each <option> should be a country's ISO 3166-1 alpha-2 code.
   */
  country?: string;
  /**
   * If not providing a countrySelector, pass the ISO 3166-1 alpha-2 code for the country you wish to search.
   */
  countrycode?: string;
  /**
   * Whether to use default styles for the suggestions list.
   * Set to false to provide your own styles, otherwise a <style> element
   * will be added to the page with default styles.
   * @default true
   */
  defaultstyles?: boolean;
  /**
   * Set to true to use Postcoder's IP to geolocation API to set a country field to the user's country.
   */
  geolocate?: boolean;
  /**
   * Filters address searches by category. UK and Ireland only.
   * Supports 'R' (Residential) and 'N' (Non-residential).
   * If left undefined, no filtering will be applied.
   */
  usercategory?: "R" | "N";
  /**
   * Limit the address suggestions to a specific postcode fragment. UK only.
   * e.g. "ip5" will limit suggestions to addresses in the postcode area IP5.
   * Leave undefined to not limit suggestions.
   */
  postcode?: string;
  /**
   * Set to false to disable grouping of geographically related suggestions in the UK and Ireland.
   */
  enablefacets?: boolean;
  /**
   * Provide a number to limit the number of suggestions returned.
   */
  maximumresults?: number;
  /**
   * Provide an identifier that will be recorded against the record of this search in the Postcoder dashboard.
   * This is useful for tracking the source of searches if you have multiple implementations of Postcoder.
   * @default "Postcoder Integrator"
   */
  identifier: string;
  /**
   * Provide a string to overwrite the default message displayed when no addresses are found.
   */
  noresultsmessage?: string;
};

/**
 * Optional address lines. The values are the query selectors for the form elements
 * where Postcoder will output the address lines from a selected address.
 */
type OptionalAddressLines = {
  [K in `addressline${2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`]?: string;
};

/**
 * What form fields do you want your data in?
 */
type OutputFields = {
  /**
   * Query selector for the form element where Postcoder will output the organisation field from a selected address.
   * Leave undefined if the form does not have a separate organisation field.
   */
  organisation?: string;
  /**
   * Query selector for the form element where Postcoder will output the address line 1 field from a selected address.
   * All addresses will have at least one address line, so this is a required field.
   */
  addressline1: string;
  /**
   * Query selector for the form element where Postcoder will output the county field from a selected address.
   * This covers states, provinces, regions, etc.
   * Leave undefined if the form does not have a separate county field.
   */
  county?: string;
  /**
   * Query selector for the form element where Postcoder will output the town field from a selected address.
   * Leave undefined if the form does not have a separate town field.
   */
  posttown?: string;
  /**
   * Query selector for the form element where Postcoder will output the postcode field from a selected address.
   * This covers ZIP codes, postal codes, etc.
   * Leave undefined if the form does not have a separate postcode field.
   */
  postcode?: string;
} & OptionalAddressLines;
