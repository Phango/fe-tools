const path = require("path");
const { realpathSync, existsSync } = require("fs");
const slash = require("slash");

const {
  getBuildConfig,
  getJSExtName,
  shouldUseHtmlCompiler,
} = require("./buildConfigHelpers");
const defaultConfig = require("../config/default.config");

const config = getBuildConfig();

const appDirectory = realpathSync(process.cwd());

const resolveApp = (relativePath) => {
  return path.resolve(appDirectory, relativePath);
};

const publicPath = process.env.PUBLIC_PATH || "/";

const appPath = resolveApp(".");
const appSrc = resolveApp(config.srcPath);

const jsEntry = () => {
  if (config.jsEntry !== defaultConfig.jsEntry) {
    return resolveApp(config.jsEntry);
  }

  const extname = path.extname(config.jsEntry);

  return resolveApp(config.jsEntry.replace(extname, getJSExtName(config)));
};

const cssEntry = resolveApp(config.cssEntry);
const appTarget = resolveApp(config.destPath);

/**
 * node's `path.join`, but with forward slashes independent of the platform
 *
 * @param {...string} paths - path segments to be joined
 * @returns {string}
 */
function join(...paths) {
  return slash(path.join(...paths));
}

/******************************************************************************
 ** CompileHTML helper
 ******************************************************************************/
const hbsEntry = shouldUseHtmlCompiler() ? resolveApp(config.hbsEntry) : "/";
const hbsTarget = shouldUseHtmlCompiler() ? resolveApp(config.hbsTarget) : "/";

module.exports = {
  resolveApp,
  publicPath,
  appPath,
  appSrc,
  jsEntry,
  cssEntry,
  appTarget,
  join,
  hbsEntry,
  hbsTarget,
};
