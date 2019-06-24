const expect = require("chai").expect;
const fs = require("@parcel/fs");
const path = require("path");

const HtmlMustacheAsset = require("../HtmlMustacheAsset");

describe("HtmlMustacheAssetTest", () => {

  const options = {
    rootDir: __dirname,
    parser: {
      getAsset: (resolved) => {
        return {
          generateBundleName: () => {
            if (resolved == path.join(__dirname, "src.css")) {
              return "bundled-src.css";
            }
            if (resolved == path.join(__dirname, "src.js")) {
              return "bundled-src.js";
            }
          }
        }
      }
    },
    publicURL: './'
  };
  const SAMPLE = "test/sample.mst";

  it("resolveDependency", async() => {
    let asset = new HtmlMustacheAsset(SAMPLE, options);
    let resolvedDep = asset.resolveDependency("src.css");
    expect(resolvedDep).not.empty;
    expect(resolvedDep.depName).to.equal("./src.css");
    expect(resolvedDep.resolved).to.equal(path.join(__dirname, "src.css"));
  });

  it("deps", async () => {
    let asset = new HtmlMustacheAsset(SAMPLE, options);
    await asset.parse();
    await asset.getDependencies();
    expect(asset.dependencies.has("./src.css")).to.be.true;
    expect(asset.dependencies.has("./src.js")).to.be.true;
  });

  it("process", async () => {
    let asset = new HtmlMustacheAsset(SAMPLE, options);
    await asset.process();
    let expectedContents = await fs.readFile(path.join(__dirname, "expected.mst"), "utf-8");
    expect(asset.contents.trim()).equal(expectedContents.trim());
  });
});
