## Usage
> 在gulpfile.js
```javascript
const gulp = require('gulp')
const postcss = require('gulp-postcss')
const imgPostToAlioss = require('./main.js')

const time = new Date()
const path = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}-${time.getHours()}-${time.getMinutes()}-${time.getSeconds()}/`

const options = {
  accessKeyId: 'your ali accessKeyId',
  accessKeySecret: 'your ali accessKeySecret',
  region: 'your ali region',
  bucket: 'your ali bucket',
  name: path, // 文件名
  https: true,
  domain: 'your domain'
}

gulp.task('css', function() {
  return gulp.src('src/**/*.css')
    .pipe(postcss([imgPostToAlioss(options)]))
    .pipe(gulp.dest('build/'))
})
```