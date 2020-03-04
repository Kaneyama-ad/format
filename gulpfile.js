// プラグイン読込
const gulp = require("gulp");
const compass = require("gulp-compass");
const cssmin = require("gulp-cssmin");
const rename = require("gulp-rename");
const ts = require("gulp-typescript");
const pug = require("gulp-pug");
const jsmin = require('gulp-jsmin');
const brows = require("browser-sync");
const plumber = require('gulp-plumber');
const connectSSI = require('connect-ssi');
const beautify = require('gulp-beautify');
const rimraf = require('gulp-rimraf');
const PATH = "ads/format";

// コードフォーマット
gulp.task('beautify-html', function() {
  console.log(" ***** beautify-html ***** ");
  return gulp
    .src('src/tmp/**/*.html')
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest("public/" + PATH + "/"))
    // .pipe(rimraf())
    ;
});

gulp.task('brows', () => {
  brows({
    port: 8000,
    startPath: "./" + PATH + "/",
    server: {
      baseDir: 'public',
      middleware: [
        connectSSI({
          ext: '.html',
          baseDir: __dirname + '/public'
        })
      ]
    }
  });
});

// ブラウザのリロード
gulp.task('reload',() => {
  console.log("RELOAD");
    brows.reload();
    console.log('Browser reload completed');
});


// pugタスク実行
gulp.task("pug", () => {
  console.log(" ***** Pugコンパイル ***** ");

  // pug形式のファイルを取得
  return gulp.src(["src/pug/**/*.pug", "!./src/pug/**/_*.pug", "!src/pug/common/**/*.pug"]) // _から始まるpugファイルは対象外
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    })) // pug実行（pretty:整形）※コンパイル
    .pipe(gulp.dest("src/tmp"))

  ;
});
// pugタスク実行
gulp.task("common", () => {
  console.log(" ***** commonコンパイル ***** ");

  return gulp.src(["src/pug/common/**/*.pug"])
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    })) // pug実行（pretty:整形）※コンパイル
    .pipe(rename({
      extname: '.shtml'
    }))
    .pipe(gulp.dest("public/" + PATH +"/common/")) // dest以下に出力
  ;
});

// tsタスク実行
gulp.task("ts", () => {
  console.log(" ***** typescriptコンパイル ***** ");

  // ts形式のファイルを取得
  return gulp.src("src/ts/*.ts")
    .pipe(plumber())
    .pipe(ts()) // ts実行
    .js // コンパイル後は必須
    .pipe(gulp.dest("public/" + PATH + "/js/")) // dest/js以下に出力
  ;
});

// compassタスク実行
gulp.task("compass", () => {
  console.log(" ***** compassコンパイル ***** ");

  // scssファイルを取得
  return gulp.src("src/scss/**/*.scss")
    .pipe(compass({
      config_file: "config.rb",
      comments: false,
      css: "public/" + PATH + "/css/",
      sass: "src/scss/"
    }))
    .pipe(brows.stream());
    ;
});

// cssminタスク実行
gulp.task("cssmin", () => {
  console.log(" ***** css圧縮 ***** ");

  return gulp.src(["public/" + PATH + "/css/**/*.css", "!public/" + PATH + "/css/**/*.min.css"])
    .pipe(cssmin())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("public/" + PATH +"/css"));
});

// jsminタスク実行
gulp.task("jsmin", () => {
  console.log(" ***** js圧縮 ***** ");

  return gulp.src(["public/" + PATH + "/js/**/*.js", "!public/" + PATH + "/js/**/*.min.js"])
    .pipe(jsmin())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest("public/" + PATH + "/js"));
});

// browsタスク実行
// gulp.task('brows', function() {
//   brows.init({
//     server: {
//       baseDir: "src",
//       index: "index.html"
//     }
//   });
// });

// watchタスク実行
gulp.task("watch", () => {
  gulp.watch("src/scss/**/*.scss", function(event) {
    gulp.run("compass");
  });
  gulp.watch(["public/" + PATH + "/css/**/*.css", "!public/" + PATH + "/css/**/*.min.css"], function(event) {
    gulp.run("cssmin");
  });
  gulp.watch("src/ts/**/*.ts", function(event) {
    gulp.run("ts");
  });
  gulp.watch("src/pug/**/*.pug", function(event) {
    gulp.run("pug");
  });
  gulp.watch("src/pug/common/**/*.pug", function(event) {
    gulp.run("common");
  });
  gulp.watch(["public/" + PATH + "/js/**/*.js", "!public/" + PATH + "/js/**/*.min.js"], function(event) {
    gulp.run("jsmin");
  });
  gulp.watch(["src/tmp/**/*.html"], function(event) {
    gulp.run("beautify-html");
  });
});

// allタスク実行
gulp.task("all", () => {
  gulp.run("compass");
  gulp.run("cssmin");
  gulp.run("ts");
  gulp.run("pug");
  gulp.run("common");
  gulp.run("jsmin");
  gulp.run("beautify-html");
});


gulp.task("default", () => {
  gulp.run("watch");
  // gulp.run("webserver");
  gulp.run("brows");
});
