// https://nodejs.dev/learn/how-to-read-environment-variables-from-nodejs
require('./node_modules/dotenv').config();

const { series } = require('gulp');
const { src, dest } = require('gulp');
const xmlPoke = require('gulp-xmlpoke');

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function updateTizenConfig() {
    return src('./build/config.xml')
        .pipe(
            xmlPoke({
                replacements: [{ xpath: '/*/@version', value: process.env.REACT_APP_VERSION }],
            }),
        )
        .pipe(dest('./build/'));
}

exports.updateTizenConfig = updateTizenConfig;
exports.default = series(updateTizenConfig);
