# Postcoder Integrator

A JavaScript library for address lookup and validation, for use in the DOM.

## Getting Started

1. **Import the Library**

Include the `index.min.js` file from the build folder in your HTML:

```html
<script src="index.min.js"></script>
```

2. **Activate the Library**

Create a new instance using the constructor:

```js
const postcoder = new PostcoderButler(options);
```

- Replace `options` with your configuration object.

## Example (index.html)

```html
<script src="index.min.js"></script>
<script>
  const butler = new PostcoderButler({
    apikey: "YOUR_API_KEY",
    searchinput: "#querySelectorForYourSearchBox",
    outputfields: {
      addressline1: "#address1",
      addressline2: "#address2",
      county: "#county",
      posttown: "#town",
      postcode: "#postcode",
    },
    // other options...
  });
</script>
```

## Library development

If you wish to fork this repository and edit it for your own needs, please feel free.

Install the required packages with `npm ci`, and run Rollup and a local development server with `npm start`.

`index.ts` initiates the library, with `handlers.ts` attaching functions from `actions.ts` to HTML elements in the DOM. Data to be shared between functions in the library is stored in objects imported from `data.ts`.

## Documentation

- See [index.html](index.html) for a usage example.
- Find more documentation for the API at https://postcoder.com/docs
- Feel free to get in [touch with us](https://postcoder.com/help-and-support) with any questions.
