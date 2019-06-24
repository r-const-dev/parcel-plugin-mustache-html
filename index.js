const logger = require("@parcel/logger");

module.exports = function(bundler) {
  bundler.addAssetType('mst', require.resolve('./HtmlMustacheAsset'));
  logger.log("parcel-plugin-mustache-html: registered for .mst assets");
}
