var gulp = require('gulp');

//SASS processing
var sass = require('gulp-sass');

//Injecting CSS and Bootstrap
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

//Vendors.css for seperate cssframeworks
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var concat = require('gulp-concat');

//Minify css, js and images
var csso = require('gulp-csso');
var gulpIf = require('gulp-if');

//Browsersync
var browserSync = require('browser-sync').create();

//Delete files
var del = require('del')

//-----------------------------------------------------------------------------------------------------------------

//                                                      Functions

 function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
}

//-----------------------------------------------------------------------------------------------------------------

//                                                      GULP tasks


//BROWSER SYNC
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})


//CLEAN
gulp.task('clean', function(){
    return del.sync('dist');
})


// SASS 
gulp.task('sass', function(){
    
    
    var injectSASS = gulp.src('app/scss/**/*.scss', {read:false});
    var injectSASSOptions = {
        
        transform: transformFilepath,
        starttag: '// inject:sass',
        endtag: '// endinject',
        addRootSlash: false  
    };
    
    var injectGlobal = gulp.src('app/global/*.scss',{read:false});
    var injectGlobalOptions = {
        
         transform: transformFilepath,
         starttag: '// inject:global',
         endtag: '// endinject',
         addRootSlash: false
    };
    
    return gulp.src('app/main.scss')
    .pipe(wiredep())
    .pipe(inject(injectGlobal,injectGlobalOptions))
    .pipe(inject(injectSASS,injectSASSOptions))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
    
});

//VENDORS
gulp.task('vendors', function(){
    return gulp.src(mainBowerFiles())
    .pipe(filter('*.css'))
    .pipe(concat('vendors.css'))
    .pipe(csso())
    .pipe(gulp.dest('app/css'));
});

gulp.task('html',function(){
            var injectFiles = gulp.src(['dist/css/main.css', 'dist/css/vendors.css']);
 
  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', 'dist']
  };
 
  return gulp.src('app/index.html')
    .pipe(inject(injectFiles, injectOptions))
    .pipe(gulp.dest('app'));
          });



//DEFAULT
gulp.task('default', ['browserSync', 'vendors', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass'])
  .on('change',browserSync.reload); 
  gulp.watch('app/*.html',['html'])
  .on('change',browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload); 
});