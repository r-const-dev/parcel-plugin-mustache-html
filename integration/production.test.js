const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const ParcelBundler = require("parcel-bundler/src/Bundler.js");

const {expectFileInDir, readExpectedFile, firstMatchFile, rmDirF, rmIntegrationNodeModules, tmpDir} = require("./integration-tools");

describe('production.test', function() {
  var outDir;
  
  before(() => {
    process.env.PARCEL_WORKERS = 1;
    rmIntegrationNodeModules();
    outDir = tmpDir();
  });

  after(() => {
    rmDirF(outDir);
    rmIntegrationNodeModules();
  });

  it ("bundle.production", async function() {
    this.timeout(5000); // Give parcel 5s to bundle.

    let opts = {
      outDir: outDir,
      cache: false,
      cacheDir: outDir,
      rootDir: __dirname,
      throwErrors: true,
      watch: false,
      autoinstall: false,
      contentHash: true,
      production: true
    };
    let bundler = new ParcelBundler(["integration/sample.mst"], opts);
    await bundler.bundle();

    expect(fs.existsSync(path.join(opts.outDir, "sample.mst"))).true;
    let mustacheContent = readExpectedFile(opts.outDir, "sample.mst");
    expect(mustacheContent, "Mustache tokens without `deps:` prefix should be preserved.")
        .contains("{{message}}");
    expect(mustacheContent, "Script urls should be absolute without an explicit publicUrl")
        .contains('<script type="text/javascript" src="/src');
    expect(mustacheContent, "CSS hrefs should be absolute without an explicit publicUrl")
        .contains('<link rel="" type="text/css" href="/src');

    let jsBundleFilename = firstMatchFile(opts.outDir, /src\.[a-zA-Z0-9]+\.js/);
    expect(jsBundleFilename.length).greaterThan(5);
    expect(mustacheContent).contains(jsBundleFilename);

    expect(fs.existsSync(path.join(opts.outDir, "sample.html")),
           "In production mode .mst template should not be expanded to html.").false;
  });
});
