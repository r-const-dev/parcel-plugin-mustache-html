const expect = require("chai").expect;
const fs = require("fs");
const path = require("path");
const ParcelBundler = require("parcel-bundler/src/Bundler.js");

const {expectFileInDir, firstMatchFile, rmDirF, rmIntegrationNodeModules, tmpDir} = require("./integration-tools");

describe('public-url.test', function() {
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
    this.timeout(6000); // Give parcel time to install modules and bundle.

    let opts = {
      outDir: outDir,
      cache: false,
      cacheDir: outDir,
      rootDir: __dirname,
      throwErrors: true,
      watch: false,
      autoinstall: false,
      contentHash: true,
      production: true,
      publicURL: '/nested'
    };
    let bundler = new ParcelBundler(["integration/sample.mst"], opts);
    await bundler.bundle();

    expect(fs.existsSync(path.join(opts.outDir, "sample.mst"))).true;
    let mustacheContent = fs.readFileSync(path.join(opts.outDir, "sample.mst"), "utf-8");
    expect(mustacheContent, "Template should prefix script urls with publicUrl")
        .contains('<script type="text/javascript" src="/nested/src');
    expect(mustacheContent, "Template should prefix css urls with publicUrl")
        .contains('<link rel="" type="text/css" href="/nested/src');
  });
});
