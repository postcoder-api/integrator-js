# Postcoder Integrator

A JavaScript library for address lookup and validation, for use in the DOM.

## Getting Started

1. **Import the Library**

Include the `integrator.min.js` file from the build folder in your HTML:

```html
<script src="integrator.min.js"></script>
```

Or via CDN:

```html
<script src="https://cdn.jsdelivr.net/gh/postcoder-api/integrator-js@v2/build/integrator.min.js"></script>
```

2. **Activate the Library**

Create a new instance using the constructor:

```js
const postcoder = new PostcoderAddressAutocomplete(options);
```

- Replace `options` with your configuration object.

## Example

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const postcoder = new PostcoderAddressAutocomplete({
      apikey: "YOUR_API_KEY",
      country: "#country",
      searchinput: "#search_input",
      outputfields: {
        addressline1: "#address_line_1",
        addressline2: "#address_line_2",
        posttown: "#post_town",
        county: "#county",
        postcode: "#postcode",
      },
    });
  });
</script>
```

## Library development

If you wish to fork this repository and edit it for your own needs, please feel free.

Install the required packages with `npm ci`, and run Rollup and a local development server with `npm start`.

`index.ts` initiates the library, with `handlers.ts` attaching functions from `actions.ts` to HTML elements in the DOM. Data to be shared between functions in the library is stored in objects imported from `data.ts`.

## Documentation

- See [index.html](https://github.com/postcoder-api/integrator-js/blob/main/build/index.html) for a usage example.
- Find more documentation at [https://postcoder.com/docs/integrations](https://postcoder.com/docs/integrations)
- Feel free to [get in touch with us](https://postcoder.com/help-and-support) with any questions.
