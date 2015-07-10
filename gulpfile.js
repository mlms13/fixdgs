var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jeet = require('jeet'),
    stylus = require('gulp-stylus'),
    prefix = require('gulp-autoprefixer'),
    nodeStatic = require('node-static'),

    port = gutil.env.port || 3000,
    paths = {
      frameless: {
        stylus: {
          main: './src-frameless/styl/index.styl',
          all: ['./src-frameless/styl/**/*.styl'],
          dest: './public/frameless/css'
        },
        html: {
          all: ['./src-frameless/index.html'],
          dest: './public/frameless'
        }
      },
      jeet: {
        stylus: {
          main: './src-jeet/styl/index.styl',
          all: ['./src-jeet/styl/**/*.styl'],
          dest: './public/jeet/css'
        },
        html: {
          all: ['./src-jeet/index.html'],
          dest: './public/jeet'
        }
      },
      dest: './public'
    };

// Frameless
gulp.task('frameless:html', function () {
  return gulp.src(paths.frameless.html.all)
    .pipe(gulp.dest(paths.frameless.html.dest));
});

gulp.task('frameless:stylus', function () {
  return gulp.src(paths.frameless.stylus.main)
    .pipe(stylus())
    .pipe(prefix())
    .pipe(gulp.dest(paths.frameless.stylus.dest));
});

// Jeet
gulp.task('jeet:html', function () {
  return gulp.src(paths.jeet.html.all)
    .pipe(gulp.dest(paths.jeet.html.dest));
});

gulp.task('jeet:stylus', function () {
  return gulp.src(paths.jeet.stylus.main)
    .pipe(stylus({ use: jeet() }))
    .pipe(prefix())
    .pipe(gulp.dest(paths.jeet.stylus.dest));
});

gulp.task('build', ['frameless:html', 'frameless:stylus', 'jeet:html', 'jeet:stylus']);

gulp.task('watch', ['build'], function () {
  // Frameless
  gulp.watch(paths.frameless.html.all, ['frameless:html']);
  gulp.watch(paths.frameless.stylus.all, ['frameless:stylus']);

  // Jeet
  gulp.watch(paths.jeet.html.all, ['jeet:html']);
  gulp.watch(paths.jeet.stylus.all, ['jeet:stylus']);
});

gulp.task('serve', ['watch'], function (cb) {
  var file = new nodeStatic.Server(paths.dest);

  require('http').createServer(function (req, res) {
    req.addListener('end', function () {
      file.serve(req, res);
    }).resume();
  }).listen(port, cb);
});

gulp.task('default', ['serve']);
