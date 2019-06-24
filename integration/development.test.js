const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");

const {firstMatchFile, readExpectedFile, rmDirF, rmIntegrationNodeModules, tmpDir} = require("./integration-tools");

const ParcelBundler = require("parcel-bundler/src/Bundler.js");

describe('development.test', function() {
  var outDir;

  before(() => {
    process.env.PARCEL_WORKERS = 1;
    rmIntegrationNodeModules();
    outDir = tmpDir();
  })

  after(() => {
    rmDirF(outDir);
    rmIntegrationNodeModules();
  });
  
  it ("bundle.development", async function() {
    this.timeout(5000); // Give parcel 5s to bundle.

    let opts = {
      outDir: outDir,
      cache: false,
      cacheDir: outDir,
      rootDir: __dirname,
      throwErrors: true,
      watch: false,
      autoinstall: false,
      production: false,
      contentHash: false,
      publicURL: './'
    };
    let bundler = new ParcelBundler(["integration/sample.mst"], opts);
    await bundler.bundle();
    
    let sampleHtmlMst = readExpectedFile(opts.outDir, "sample.mst");
    let jsBundleFilename = firstMatchFile(opts.outDir, /src\.[a-zA-Z0-9]+\.js/);
    expect(sampleHtmlMst).contains('<script type="text/javascript" src="' + jsBundleFilename + '"></script>');

    let sampleHtml = readExpectedFile(opts.outDir, "sample.html");
    expect(sampleHtml).contains('<p>Devel rendering of the mst.</p>');
    expect(sampleHtml).contains('<script type="text/javascript" src="' + jsBundleFilename + '"></script>');
  });
});
