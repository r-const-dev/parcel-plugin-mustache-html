const path = require("path");
const fs = require("fs");
const tmp = require("tmp");
const expect = require("chai").expect;

/** Creates a temp directory for integration output. Returns its absolute path. */
function tmpDir() {
  return tmp.dirSync({prefix: "parcel-plugin-mustache-html-test-"}).name;
}

/** Recursively deletes a directory and its content. */
function rmDirF(dirPath) {
  for (let dirEntry of fs.readdirSync(dirPath)) {
    let dirEntryPath = path.join(dirPath, dirEntry);
    if (fs.lstatSync(dirEntryPath).isDirectory()) {
      rmDirF(dirEntryPath);
    } else {
      fs.unlinkSync(dirEntryPath);
    }
  }
  fs.rmdirSync(dirPath);
}

/** Shortcut for asserting on existence of a file in a directory. */
function expectFileInDir(dir, filename) {
  expect(fs.existsSync(path.join(dir, filename))).true;
}

/** Find first file that matches given regex in a directory. */
function firstMatchFile(dirPath, regex) {
  for (let filename of fs.readdirSync(dirPath)) {
    if (regex.test(filename)) {
      return filename;
    }
  }
  return;
}

/** Convenience method for reading the content of a file in a directory. Asserts file exist. */
function readExpectedFile(dirPath, filename) {
  expectFileInDir(dirPath, filename);
  return fs.readFileSync(path.join(dirPath, filename), "utf-8");
}

/** Removes node_modules and package-lock.json created in integration directory. */
function rmIntegrationNodeModules() {
  expectFileInDir(__dirname, "package.json");
  let packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf-8"));
  const expectedPackageName = "parcel-plugin-mustache-html-integration";
  if (packageJSON.name != expectedPackageName) {
    throw new Error("To prevent accidental removal of node_modules outside integration cleanup, "
                    + "this method is testing the name of the package.json. "
                    + "Expected package name [" + expectedPackageName + "], "
                    + "but was [" + packageJSON.name + "].");
  }
  let nodeModulesPath = path.join(__dirname, "node_modules");
  if (fs.existsSync(nodeModulesPath)) {
    rmDirF(nodeModulesPath);
  }
  let packageLockPath = path.join(__dirname, "package-lock.json");
  if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
  }
}

module.exports = {
  expectFileInDir,
  firstMatchFile,
  readExpectedFile,
  rmDirF,
  rmIntegrationNodeModules,
  tmpDir,
}
