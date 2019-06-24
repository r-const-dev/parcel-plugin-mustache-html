# parcel-plugin-mustache-html

## Description

**Summary**: Resolves links to parcel assets inside mustache templates.

This plugin allows bundling mustache templates intended for html rendering in parcel.
It extracts any mustache token with the format `{{dep:*}}`, resolve corresponding dependency as a parcel asset and links the packaged bundle.
Plugin is triggered on `.mst` extension.

The main use case is a mustache template used on server side to render an html page that uses static assets bundled using parcel.
To assist with this use case, **parcel-plugin-mustache-html** has a secondary functionality to expand `.mst` template into a `.html` page in development mode.

## Details

**parcel-plugin-mustache-html** plugin is triggered on `.mst` extension, e.g. `sample.mst`.
It parses the `.mst` file and replaces any `{{dep:*}}` token with the corresponding reference as bundled by parcel.

<details>
  <summary>`.html` expansion in development mode</summary>
  In order to expand a mustache template to its html representation for development purposes,
  it is required to have a `.view` json for the data to use in development.
  
  For example, consider that source `random-sample.mst` is:
  ```html
  <html>
    <head><title>Hello, parcel-plugin-mustache-html</title></head>
    <body>
      <p>{{message}}</p>
      <script type="text/javascript" src="{{dep:impl.js}}"></script>
    </body>
  </html>
  ```

  `{{message}}` mustache token is preserved in the output `.mst` file.
  However, for development purposes this can be expanded into a `.html` file by providing `random-sample.mst.view`:
  ```json
  {
    "message": "Html expansion demo"
  }
  ```

  The existence of the `.mst.view` file triggers expansion of the `.html` file, i.e. `random-sample.html` given above setup:
  ```html
  <html>
    <head><title>Hello, parcel-plugin-mustache-html</title></head>
    <body>
      <p>Html expansion demo</p>
      <script type="text/javascript" src="impl.234hash234.js"></script>
    </body>
  </html>
  ```
</details>

## Limitations

In the initial version, 1.0.0, **parcel-plugin-mustache-html** comes with the following limitations:
+ Handles only `.mst` extension and doesn't provide a mechanism to ignore matching files, i.e. allow other plugins to handle `.mst` files.
+ It doesn't allow customization of tags to identify mustache tokens, uses only the defaults (`["{{", "}}"]`).
+ Expands mustache template only to `.html` and only in development.

