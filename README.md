# project-template
Project template based on gulp, jade and postcss.
## Install
```
git clone https://github.com/yakhinvadim/project-template
cd project-template
npm install
```
then you can run tasks, described below
## Tasks

Command | Task
:--- | :---
`gulp build` | build 'dist' folder from 'src' folder
`gulp watch` | watch for changes in source folders and automatically run tasks to process these changes
`gulp html` | compile .jade files to .html files
`gulp css` | concatenate .css files, process css with postcss-processors, create source-map for result css
`gulp js` | copy .js files from src to dist folder without changes
`gulp img` | optimize images
`gulp icons` | build svg-sprite from separate svg-icons
`gulp ftp` | upload dist folder to ftp (don't forget to provide credentials and upload address in gulpfile.js)
`gulp clean` | delete dist folder |
`static-server dist` | run localhost:9080
