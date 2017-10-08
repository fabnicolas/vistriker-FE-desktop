/*  Gulp script necessary to ease build of Electron application.
    Run this script with 'npm run build' which calls 'gulp smart_build'.

    This is necessary for the way build process runs: it actually invokes 'electron-packager'.
    A problem arised during the development process (Suppose /electron as root folder):
    - If you run 'electron-packager-build' on root folder as src, with source files directly inside root,
        'node_modules' folder with other build files gets bundled inside Electron releases.
        Those files are UNNECESSARY and causes extra MB disk space, due to the fact they bundle gulp and other modules.
    SOLUTION: separate source files from root in a subdirectory, /src, and specify /src as source folder
        for electron-packager.
    - Due to the new change, Electron application wasn't running because it was missing 'package.json' and
        'package-lock.json' which specify how to run js files. So everytime you have to copy those two files
        from /src folder manually... Nah, let Gulp do this for you. ;D
    
    Below for each task there is a description of what it does.
*/

// Modules to import
const gulp  = require('gulp');  // Gulp!
const gutil = require('gulp-util'); // For logging.
const gexec = require('gulp-exec'); // For invoking commands.
const del = require('del'); // For deleting files.
const runSeq = require('run-sequence'); // For task-chain sequentially.

/*  #1 subtask of 'smart_build'.
    This subtask copies the following files from root to /src folder:
    - package.json
    - package-lock.json
    To prepare 'actual_build' task to bundle those files inside our Electron application.
*/
gulp.task('copy_package_json', function() {
    gutil.log("Copying package*.json files inside src folder for build purposes...")
    return gulp.src('./package*.json').pipe(gulp.dest('./src'));
});

/*  #2 subtask of 'smart_build'.
    This subtask executes 'npm run electron-packager-build' and reports the output.
    
    Actually Electron builds for the following architectures:
    - linux armv7
    - linux ia32
    - linux x64
    - win32 ia32
    - win32 x64

    In the respective folders in root.
    To invoke npm and read output streams back we use NPM module 'gulp-exec'.
*/
gulp.task('actual_build', function(){
    gutil.log("Building Electron application...")
    return gulp.src('./').pipe(gexec('npm run electron-packager-build'))
                    .pipe(gexec.reporter({err:true, stderr:true, stdout:true}));
});

/*  #3 subtask of 'smart_build'.
    This task reverts 'copy_package_json', removing 'package.json' and 'package-lock.json'
    inside /src folder.
    To delete files we use NPM module 'del'.
*/
gulp.task('clean_package_json', function(){
    gutil.log("Cleaning package.json transferred inside /src for build purposes...");
    return del('./src/package*.json').then(gutil.log("Ok!"));
});

/*  Task 'smart_build' is an advanced version of 'electron-packager' build task.
    It runs in order the following build tasks:
    - copy_package_json
    - actual_build
    - clean_package_json
    You can read the description of the single tasks in their respective sections.

    To execute those 3 tasks sequentially we use NPM module 'run-sequence'.
    Tasks are all logged using NPM module 'gulp-util'.
*/
gulp.task('smart_build', function(callback){
    runSeq('copy_package_json', 'actual_build', 'clean_package_json', callback);
})