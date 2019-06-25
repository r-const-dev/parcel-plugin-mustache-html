# parcel-plugin-mustache-html

## Description

**Summary**: Resolves links to parcel assets inside mustache templates.

This plugin allows bundling mustache templates, intended for server side html rendering, in parcel.
It extracts any mustache token with the format `{{dep:*}}`, resolve corresponding dependency as a parcel asset and links the packaged bundle.

Plugin is triggered on `.mst` extension.

The main use case is a mustache template used on server side to render an html page that uses static assets bundled using parcel.
To assist with this use case, **parcel-plugin-mustache-html** has a secondary functionality to expand `.mst` template into a `.html` page in development mode.

**parcel-plugin-mustache-html** plugin is triggered on `.mst` extension, e.g. `sample.mst`.
It parses the `.mst` file and replaces any `{{dep:*}}` token with the corresponding reference as bundled by parcel.

## Usage

**parcel-plugin-mustache-html** is a parcel plugin which requires only to be installed in order for parcel to recognize it:

```sh
npm install --save-dev parcel-plugin-mustache-html
```

Once installed, **parcel-plugin-mustache-html** will process any `.mst` asset, e.g.

```sh
npx parcel --out-dir devel random-sample.mst
```

For example, consider `random-sample.mst` source mustache template with a javascript reference specified as `{{dep:}}`:
```html
<html>
  <head><title>Hello, parcel-plugin-mustache-html</title></head>
  <body>
    <p>{{message}}</p>
    <script type="text/javascript" src="{{dep:impl.js}}"></script>
  </body>
</html>
```

**parcel-plugin-mustache-html** produces `devel/random-sample.mst` with javascript reference expanded. Any other mustache token is preserved:
```html
<html>
  <head><title>Hello, parcel-plugin-mustache-html</title></head>
  <body>
    <p>{{message}}</p>
    <script type="text/javascript" src="impl.234fae32.js"></script>
  </body>
</html>
```

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

  **parcel-plugin-mustache-html** discovers `random-sample.mst.view` file and expands it to `.html` file, i.e. `devel/random-sample.html`:
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

In the initial version, 1.0.1, **parcel-plugin-mustache-html** comes with the following limitations:
+ Handles only `.mst` extension and doesn't provide a mechanism to ignore matching files, i.e. allow other plugins to handle `.mst` files.
+ It doesn't allow customization of tags to identify mustache tokens, uses only the defaults (`["{{", "}}"]`).
+ Expands mustache template only to `.html` and only in development.

