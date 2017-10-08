const gulp  = require('gulp');
const gutil = require('gulp-util');
const gexec = require('gulp-exec');
const del = require('del');
const runSeq = require('run-sequence');

gulp.task('copy_package_json', function() {
    gutil.log("Copying package*.json files inside src folder...")
    return gulp.src('./package*.json').pipe(gulp.dest('./src'));
});

gulp.task('actual_build', function(){
    gutil.log("Invoking 'npm run build'...")
    return gulp.src('./').pipe(gexec('npm run electron-packager-build'))
                    .pipe(gexec.reporter({err:true, stderr:true, stdout:true}));
});

gulp.task('clean_package_json', function(){
    gutil.log("Deleting...");
    return del('./src/package*.json').then(gutil.log("Ok!"));
});

gulp.task('smart_build', function(callback){
    runSeq('copy_package_json', 'actual_build', 'clean_package_json', callback);
})