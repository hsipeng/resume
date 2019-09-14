const gulp          = require('gulp')
const pug           = require('gulp-pug')
const marked        = require('marked')
const browserSync   = require('browser-sync').create()
const Airtable      = require('airtable')
const base          = Airtable.Base('appp11u59wv6QMEUV')
const fs = require('fs')

function convertStory (story) {
    let _story = {
        date: story.date,
        content: marked(story.content),
        highlight: story.highlight,
        images: story.images,
        tags: story.tags
    }
    return _story
}

function loadStories () {
    return new Promise((resolve, reject) => {
        fs.readFile('data/stories.json','utf8', (err, data) => {
          if (err) return reject(err)
          const {stories}  =  JSON.parse(data)
          console.log('data',data,stories)
            resolve({stories: stories.map(convertStory)})
        });
    }).catch(err => console.log)
}

// function convertStory (story) {
//     let _story = {
//         date: story.get('date'),
//         content: marked(story.get('content')),
//         highlight: story.get('highlight'),
//         images: story.get('images'),
//         tags: story.get('tags')
//     }
//     return _story
// }

// function loadStories () {
//     return new Promise((resolve, reject) => {
//         base('stories').select({
//             sort: [{
//                 field: 'date',
//                 direction: 'desc'
//             }]
//         }).firstPage((err, stories) => {
//             console.log('stories.length',err,stories)
//             if (err) return reject(err)
//             resolve({
//                 stories: stories.map(convertStory)
//             })
//         })
//     }).catch(err => console.log)
// }

gulp.task('index', function() {
    return loadStories()
        .then((data) => {
            console.log('data',data)
            return gulp.src('src/index.pug')
                .pipe(pug({
                    data: data,
                    pretty: true
                }))
                .pipe(gulp.dest('./'))
                .pipe(browserSync.stream())
        })
})

gulp.task('resume', function() {
    return gulp.src('src/resume.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream())
})


gulp.task('dev', ['index', 'resume'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(['src/*', 'style.css'], ['index', 'resume'])
})

gulp.task('dev:resume', ['resume'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(['src/*', 'style.css'], ['resume'])
})

gulp.task('dev:index', ['index'], () => {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch(['src/*', 'style.css'], ['index'])
})