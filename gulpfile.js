const gulp = require('gulp');
const ts = require('gulp-typescript');
const shell = require('gulp-shell');
var runSeq = require('run-sequence');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('run', shell.task(['node dist/index.js']));

gulp.task('watch', () => {
    gulp.watch('src/**/*.ts', ['build']);
});

// gulp.task('build', ['scripts'], shell.task(['node dist/index.js']));

gulp.task('assets', function () {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (cb) => {
    runSeq('scripts', 'assets', 'run');
})


gulp.task('default', ['build', 'watch']);
