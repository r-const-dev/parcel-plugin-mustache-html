const expect = require("chai").expect;

describe('index.test', function() {

  it ("register", () => {
    let bundler = {
      assetTypes: [],
      addAssetType: (extension, path) => {
        expect(extension).equal("mst");
        bundler.assetTypes.push(extension);
      }
    }
    require("../index")(bundler);
    expect(bundler.assetTypes).deep.equal(["mst"]);
  });
});
