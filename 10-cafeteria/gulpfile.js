const {src, dest, watch, series, parallel } = require('gulp')


/* CSS Y SASS */
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
/* que no va decir donde se encuentra el archivo original */
const sourcemaps = require('gulp-sourcemaps')
/* minificar  nuestro códgio */
const cssnano = require('cssnano')


/* IMAGENES */
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')

function css(done){
    // compilar ssas
    // paso 1 identificar archivo (src) 2- compilarla, 3- guardar el .css
    /* 
        nos entrega una hoja minificada sass({ outputStyle: 'expanded'}) css
        normal { outputStyle: 'expanded'}
    */
    src('src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe( sass())
    .pipe(postcss( [autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/css'))

    done()
}

function imagenes(){
   return src('src/img/**/*') /* carga todas las imagen sin imoirtar el formato */
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe(dest('build/img'));

   
}

function versionWebp(){
    /* hacer una version más ligera */
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))
}

function versionAvif(done){
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))


    done()
}
function dev(){
    /* atento 2 cosas  */
    // donde esta el archivo 2, vuelve a llamar la funcion
    // watch('src/scss/header/_header.scss', css) lee un archivo solo _header.scss
    watch('src/scss/**/*.scss', css) //comodin
    watch('src/img/**/*', imagenes)
    // watch('src/scss/app.scss', css )
}

// function tareaDefault (){
//     console.log('soy la tarea por default');
// }

exports.css = css
exports.dev = dev
exports.imagenes = imagenes
// exports.versionAvif = versionAvif
// exports.versionWebp = versionWebp
exports.default = series( imagenes, versionAvif, versionWebp,  css, dev)

// exports.default = parallel(css, dev)
// series ejecuta la primera tarea y luego que la completa se va la segunda  (lo ejecuto usando gulp)
//  parallel - todas las tareas inician al mismo tiempo