# parcel-plugin-mustache-html

## Resolve dependencies inside mustache templates

This parcel plugin bundles mustache templates that intended primarily for server side html rendering.

**parcel-plugin-mustache-html** processes files with `.mst` extension and outputs the `.mst` file with `{{dep:*}}` links resolved.
Extracts any mustache token with the format `{{dep:*}}`, resolve corresponding dependency and replaces it with the packaged bundle by parcel.

The main use case is to build a client side html web application that is mostly independent from server, but still allows some server side rendering. For example the client side application requires a logged-in user, which is only known by the server.
To assist with this use case, **parcel-plugin-mustache-html** has a secondary functionality to expand `.mst` template into a `.html` page in development mode.

## Installation

**parcel-plugin-mustache-html** is a parcel plugin which requires only to be installed in order for parcel to recognize it:

```sh
npm install --save-dev parcel-plugin-mustache-html
```

## Usage

Consider the following `random-sample.mst` source mustache template with a javascript reference specified as `{{dep:*}}`:
```html
<html>
  <head><title>Hello, parcel-plugin-mustache-html</title></head>
  <body>
    <p>{{message}}</p>
    <script type="text/javascript" src="{{dep:impl.js}}"></script>
  </body>
</html>
```

Ask parcel to bundle `random-sample.mst`, **parcel-plugin-mustache-html** is triggered by `.mst` file extension.

```sh
npx parcel random-sample.mst
```

This `dist/random-sample.mst` with javascript reference expanded and any other mustache token preserved:
```html
<html>
  <head><title>Hello, parcel-plugin-mustache-html</title></head>
  <body>
    <p>{{message}}</p>
    <script type="text/javascript" src="impl.234fae32.js"></script>
  </body>
</html>
```

In development mode the `.mst` mustache template could be expanded into a `.html` output by providing data for the rest of mustache tokens.
<details>
  <summary>`.html` expansion in development mode</summary>

  In order to expand a mustache template to its html representation for development purposes,
  add json mustache `.view` containing data to use in development. The `.view` json file
  needs to be located near the corresponding `.mst` file and have the name composed from
  the original filename + `.view` extension.
  
  For the example mustache template above, the json view should be named `random-sample.mst.view`:
  ```json
  {
    "message": "Html expansion demo"
  }
  ```

  **parcel-plugin-mustache-html** discovers `random-sample.mst.view` file and expands it to `.html` file, i.e. `dist/random-sample.html`:
  ```html
  <html>
    <head><title>Hello, parcel-plugin-mustache-html</title></head>
    <body>
      <p>Html expansion demo</p>
      <script type="text/javascript" src="impl.234fae32.js"></script>
    </body>
  </html>
  ```

</details>

## Limitations

**parcel-plugin-mustache-html** comes with the following known limitations:
+ Handles only `.mst` extension and doesn't provide a mechanism to ignore matching files, i.e. allow other plugins to handle `.mst` files.
+ It doesn't allow customization of tags to identify mustache tokens, uses only the defaults (`["{{", "}}"]`).
+ Expands mustache template only to `.html` and only in development.

Please file a feature request or contribute code on github if these limitations are blocking you. [parcel-plugin-mustache-html@github](https://github.com/r-const-dev/parcel-plugin-mustache-html)