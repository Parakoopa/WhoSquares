const gulp = require("gulp");

const browserify = require('browserify');
const sourcemapify = require('sourcemapify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');

gulp.task("js", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: [
            'src/client/scripts/ui/main.tsx'
        ],
        paths: [
            'src/client/scripts/',
            'src/common/scripts/',

        ]
    })
        .require('react')
        .require('react-dom')
        .require('react-dom')
        .require('react-router')
        .require('react-router-dom')
        .plugin(tsify, {project: "./src/client/tsconfig.json"})
        .plugin(sourcemapify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("src/client/dist/"));
});

/*
 * Watch for changes in files.
 */
gulp.task('watch', function() {
    gulp.watch(['src/**/*.ts','src/**/*.tsx'], ['js']);
});

gulp.task('default', ['js', 'watch']);