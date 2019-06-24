const Asset = require("parcel-bundler/src/Asset");
const fs = require("fs");
const logger = require("@parcel/logger");
const mustache = require('mustache');
const isURL = require('parcel-bundler/src/utils/is-url');
const urlJoin = require('parcel-bundler/src/utils/urlJoin');

class HtmlMustacheAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = "mst";
  }

  async parse() {
    this.astContents = this.contents;  // Preserve parsed source for transform.
    try {
      return mustache.parse(this.contents);
    } catch (e) {
      logger.error("Failed to parse mustache template. Error: " + e);
      throw e;
    }
  }

  async collectDependencies() {
    this.collectTokenDependencies(this.ast);
  }

  collectTokenDependencies(tokens) {
    for (let token of tokens) {
      switch (token[0]) {
        case 'name':
          if (token[1].startsWith("dep:")) {
            logger.verbose("Found mst dependency: " + token[1].substring(4));
            let assetPath = this.addURLDependency(token[1].substring(4));
            if (!isURL(assetPath)) {
              assetPath = urlJoin(this.options.publicURL, assetPath);
            }
            token[0] = 'text';
            token[1] = assetPath;
          }
          break;
        case '#':
        case '^':
        case '>':
          this.collectTokenDependencies(token[4]);
          break;
      }
    }
  }

  async transform() {
    let contents = [];
    this.transformTokens(this.ast, contents);
    this.contents = contents.join('');
  }

  transformTokens(tokens, contents) {
    for (let token of tokens) {
      switch (token[0]) {
        case 'text':
          contents.push(token[1]);
          break;
        case '#':
        case '^':
        case '>':
          contents.push(this.astContents.substring(token[2], token[3]));
          this.transformTokens(token[4], contents);
          break;
        default:
          contents.push(this.astContents.substring(token[2], token[3]));
      }
    }
  }

  async generate() {
    if (!this.shouldExpandMst()) {
      return super.generate();
    }
    return [
      {
        type: this.type,
        value: this.contents,
        final: true
      },
      {
        type: 'html',
        value: "" // Empty, to skip actual html processing by HTMLAsset.
      }
    ]
  }

  async postProcess(generated) {
    if (Array.isArray(generated)) {
      for (let rendition of generated) {
        if (rendition.type == 'html') {
          rendition.value = this.expandMst();
        }
      }
    }
    return generated;
  }

  shouldExpandMst() {
    if (this.options.production) {
      return false;
    }
    let develViewPath = this.getDevelViewPath();
    if (fs.existsSync(develViewPath)) {
      logger.verbose("Found .mst.view to expand .mst into .html: " + develViewPath);
      return true;
    } else {
      logger.verbose(".mst.view not found, skip expanding .mst into .html" + develViewPath);
      return false;
    }
  }

  /** Expands this.contents using JSON view specified in the .mst.view
   * corresponding to the mustache .mst template handled by this asset.
   * 
   * Assumes the transformation of .mst has already been applied,
   * i.e. all {{dep:*}} tokens are expanded to their representation.
   */
  expandMst() {
    try {
      let develView = JSON.parse(fs.readFileSync(this.getDevelViewPath(), "utf-8"));
      return mustache.render(this.contents, develView);
    } catch (e) {
      logger.warn("Invalid .mst.view or cannot render, expected a valid JSON.");
      throw e;
    }
  }

  getDevelViewPath() {
    return this.name + ".view"; // this.name is resolved.
  }
}

module.exports = HtmlMustacheAsset;