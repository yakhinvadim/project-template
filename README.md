# project-template
Project template based on gulp, jade and postcss.
## Install
*If you don't have Node.js, install it from
[official site](https://nodejs.org/en/)*

*If you don't have gulp.js, install it, by running `npm install -g gulp`
in your terminal.*

If Node.js and gulp.js are installed run the following:

Action | Command
:--- | :---
clone repository | `git clone https://github.com/yakhinvadim/project-template your-project-name`
enter project folder | `cd your-project-name`
install dependencies | `npm install`

after installing, you can run tasks, described below
## Tasks

### Primary tasks

Command | Task
:--- | :---
`gulp build` | build /dist from /src
`gulp watch` | build, then watch for changes in /src and automatically run secondary tasks (below) to process these changes
`gulp` | build, run [localhost:4000](http://localhost:4000/) and watch for changes

### Secondary tasks

Command | Task
:--- | :---
`gulp html` | compile .jade to .html
`gulp css` | concatenate .css, process with postcss processors and create source-map
`gulp js` | copy .js to /dist without changes
`gulp fonts` | copy fonts to /dist without changes
`gulp img` | optimize images
`gulp sprite-svg` | build svg-sprite from separate svg-icons
`gulp temp` | copy temporarily files to /dist without changes

### Support tasks

Command | Task
:--- | :---
`gulp ftp` | upload /dist to ftp (don't forget to provide credentials and upload address in section **variables** in gulpfile.js)
`gulp clean` | clean /dist
