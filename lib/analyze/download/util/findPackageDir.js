'use strict';

const path = require('path');
const loadJsonFile = require('load-json-file');
const globby = require('globby');

const log = logger.child({ module: 'util/find-package-dir' });

/**
 * Searches for the real package dir after testing against the root one fails.
 *
 * @param {Object} packageJson - The package.json from the registry.
 * @param {String} dir - The folder in which the package was downloaded.
 *
 * @returns {Promise} A promise that resolves with the package dir or null.
 */
function lookForPackageDir(packageJson, dir) {
    // Gather all package json files
    return globby('**/package.json', {
        cwd: dir,
        // Only return files
        onlyFiles: true,
        // Ignore symlinks to avoid loops
        followSymlinkedDirectories: false,
    })
    // Transform them into directories, removing the root one
    .then((files) => (
        files
        // Filter root one
        .filter((file) => file !== 'package.json')
        // Build dir arrays from matched files
        .map((file) => path.join(dir, path.dirname(file)))
    ))
    // Find the one that matches the package
    .reduce((packageDir, possiblePackageDir) => {
        if (packageDir) {
            return packageDir;
        }

        return isSamePackage(packageJson, possiblePackageDir)
        .then((isSame) => isSame ? possiblePackageDir : null);
    }, null);
}

/**
 * Tests if a directory matches the package we are looking for.
 *
 * @param {Object} packageJson - The package.json from the registry.
 * @param {String} dir - The folder we are testing against.
 *
 * @returns {Promise} A promise that resolves with true if it matched, false otherwise.
 */
function isSamePackage(packageJson, dir) {
    const file = `${dir}/package.json`;

    return loadJsonFile(file)
    // Ignore if the file doesn't exist
    .catch({ code: 'ENOENT' }, () => ({}))
    // Ignore any errors but log them
    .catch((err) => {
        log.debug({ err, file }, 'Error reading package.json');

        return {};
    })
    .then((downloadedPackageJson) => packageJson.name === downloadedPackageJson.name);
}

// -----------------------------------------------------

/**
 * Finds the real package directory.
 *
 * If the package.json file at the root matches, the `packageDir` will be the same as `dir`.
 * If not, this function will do a deep search for a package.json that matches.
 *
 * For standard repositories, `packageDir` will be equal to the `dir`.
 * For mono repositories, `packageDir` will be a sub-directory of `dir` pointing to where the package actually is.
 * If we couldn't find the `packageDir`, `dir` will be returned.
 *
 * @param {Object} packageJson - The package.json from the registry.
 * @param {String} dir - The folder in which the package was downloaded.
 *
 * @returns {Promise} A promise that resolves with the package directory.
 */
function findPackageDir(packageJson, dir) {
    // Short-circuit to check against the root
    return isSamePackage(packageJson, dir)
    // Find using glob
    .then((isSame) => isSame ? dir : lookForPackageDir(packageJson, dir))
    // Fallback to using the root dir
    .then((packageDir) => packageDir || dir);
}

module.exports = findPackageDir;
